import MongoShareCandidate from "../repositories/implementations/mongoShareCandidate.js";


class ShareCandidateService {
  constructor (){
    this.shareCandidateRepository = new MongoShareCandidate()//
  }

  // create group and generate share linkk

  async createShareUsers (users){
    // user = groupName and selctedUsers

        return await this.shareCandidateRepository.createCandidate(users)
  }

  // get single link
  async shareShareUser (shareId){
    return await this.shareCandidateRepository.shareCandidate(shareId)
  }

  // get all group members

  async getAllGroups(){
    return await this.shareCandidateRepository.getAllGroups();

  }

  // update group

  async updateGroup(id , users){
    return await this.shareCandidateRepository.updateGroup(id , users);
  }

  async deleteGroup(id){
    return await this.shareCandidateRepository.deleteGroup(id);
  }

  // delete user from group
  async removeUserFromGroup(groupId, userId) {
        if (!groupId || !userId) {
            throw new Error('Group ID and User ID are required');
        }
        return await this.shareCandidateRepository.removeUserFromGroup(groupId, userId);
    }


    // add user to existing group
    async addUserToGroup(groupId, userId) {
        if (!groupId || !userId) {
            throw new Error('Group ID and User ID are required');
        }
        return await this.shareCandidateRepository.addUserToGroup(groupId, userId);
    }

    async getSingleGroup(id){
      if(!id){
        throw new Error('Group ID is required');
      }
      return await this.shareCandidateRepository.getSingleGroup(id);
    }
}

export default ShareCandidateService