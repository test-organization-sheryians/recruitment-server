import { CandidateProfile } from "../../models/candidateProfile.model.js";
import shareCandidateModel from "../../models/shareCandidate.model.js";
import IShareCandidate from "../contracts/IShareCandidate.js";
import mongoose from 'mongoose';
import {AppError} from "../../utils/errors.js";
import MongoCandidateProfileRepository from "./mongoCandidateProfileRepository.js";


class MongoShareCandidate extends IShareCandidate {

  // create group and generate share linkk
  async createCandidate(users) {

   try {
     const share = await shareCandidateModel.create({  
      groupName: users.groupName,
      selectedUsers: users.selectedUsers, 
    });

    const shareLink = `hire.sheriyans.com/api/share/${share._id}`; // Construct the shareable link using the share ID
    return {
      shareLink, 
      group: share 
   } 
  } 
  catch (error) {
    throw new AppError(
        `Failed to  create group: ${error.message}`,
        500,
        error
      );
   }
  }

  // get single group
  async getSingleGroup(id) {
    try {
      const group = await shareCandidateModel.findById(id)
        .populate('selectedUsers', 'firstName lastName email role');
      return group;
    } catch (error) {
      throw new AppError(
        `Failed to fetch single group: ${error.message}`,
        500,
        error
      );
    }
  }

  

  // Get all groups with member count
  async getAllGroups() {
    try {
      const groups = await shareCandidateModel.aggregate([
        {
          $project: {
            _id: 1,
            groupName: 1,
            createdAt: 1,
            updatedAt: 1,
            // It calculates the size of the 'selectedUsers' array instantly
            memberCount: { $size: { $ifNull: ["$selectedUsers", []] } } 
          }
        },
        { 
          $sort: { createdAt: -1 } // Sort by newest first
        }
      ]);

      return groups;

    } catch (error) {
      throw new AppError(
        `Failed to fetch groups: ${error.message}`,
        500,
        error
      );
    }
  }

  // update group

  async updateGroup(id , users){
    try{
      const updatedGroup = await shareCandidateModel.findByIdAndUpdate(id, users,{new:true})
      .populate('selectedUsers', 'firstName lastName email ');

      if(!updatedGroup) throw new AppError('Group not found', 404);
      return updatedGroup;


    }
    catch(error){
      throw new AppError(
        `Failed to update group: ${error.message}`,
        500,
        error
      );
    }
  }


  // delete group

  async deleteGroup(id){
    try{

      const deleteGroup = await  shareCandidateModel.findByIdAndDelete(id);
      if(!deleteGroup) throw new AppError('Group not found', 404);

      return deleteGroup;
      
    }
    catch(error){
      throw new AppError(
        `Failed to delete group: ${error.message}`,
        500,
        error
      );
    }
  }


  // delete user from group
   async removeUserFromGroup(groupId, userId) {
        try {
            const updatedGroup = await shareCandidateModel.findByIdAndUpdate(
                groupId,
                { 
                    $pull: { selectedUsers: userId }  // Removes ONLY this userId from the array
                },
                { new: true } // Return the updated group so we can see the change
            ).populate('selectedUsers', 'firstName lastName email role');

            if (!updatedGroup) {
                throw new AppError('Group not found', 404);
            }

            return updatedGroup;
        } catch (error) {
            throw new AppError(`Failed to remove user: ${error.message}`, 500);
        }
    }

    // add user to existing group

    async addUserToGroup(groupId, userId) {
        try {
            const updatedGroup = await shareCandidateModel.findByIdAndUpdate(
                groupId,
                { 
                    $addToSet: { selectedUsers: userId } //  Key Logic: Adds only if not already there
                },
                { new: true }
            ).populate('selectedUsers', 'firstName lastName email role');

            if (!updatedGroup) {
                throw new AppError('Group not found', 404);
            }

            return updatedGroup;
        } catch (error) {
            throw new AppError(`Failed to add user: ${error.message}`, 500);
        }
    }

  async shareCandidate(shareId) {
    try {


      const share = await shareCandidateModel.findById(shareId)
      .populate('selectedUsers', 'firstName lastName email role phoneNumber address'); // Populate the selectedUsers with their details

      if (!share) {
         throw new AppError('Invalid or expired link', 404);

      }

        
      
      const candidateRepo = new MongoCandidateProfileRepository();

      const userIds = share.selectedUsers.map(user => user._id)

     const pipeline = candidateRepo._getProfileAggregationPipeline(userIds);

     const fetchedProfiles = await CandidateProfile.aggregate(pipeline);

     const completeProfiles = share.selectedUsers.map((user) => {
        const foundProfile = fetchedProfiles.find(
          (p) => p.userId.toString() === user._id.toString()
        );

        if (foundProfile) {
          return foundProfile;
        }
    
    
 
    return{
      userId: user._id,
      user:{
        id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      

    },

   
   socialLinks: { linkedin: "", github: "", portfolio: "", twitter: "" },
    resumeFile: null ,// or you can set it to a default value if needed
    experiences: [],
    skills:[],
    contactInfo: { phone: user.phoneNumber || "", address: user.address || "" }
  };
});

//const profiles = (await Promise.all(profilesPromises)).filter(Boolean);

    
    
      return ({ 
            groupName: share.groupName,
            count :completeProfiles.length,


           data: completeProfiles
        }) 
      
      
      // Return count and data in the response because the frontend needs both to display the data and show the count of shared candidates.
    } catch (error) {
      console.error(error);
      throw new AppError(  `Failed to fetch shared candidates: ${error.message}`,   500,  error );
    }
  }
}


export default MongoShareCandidate