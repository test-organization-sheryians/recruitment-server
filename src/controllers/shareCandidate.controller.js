
import ShareCandidateService from '../services/shareCandidate.service.js';
class ShareCandidateController {
  constructor (){
    this.shareCandidateService = new ShareCandidateService()
  }

  createShareCandidate = async (req,res,next)=>{
    try {
     const { users } = req.body;
      const response = await this.shareCandidateService.createShareUsers(users)
       res.status(201).json({
      message: 'Share link created',
      shareLink:response,
       })
    } catch (error) {
      next(error)
    }
  }

  shareShareCandidate = async (req,res,next)=>{
    try {
      const { shareId } = req.params;

        const response = await this.shareCandidateService.shareShareUser(shareId)
       return res.status(200).json({
       message: 'Shared candidates fetched successfully',
       count: response.count,
       data: response.data,
    });
      
    } catch (error) {
      next(error)
    }
  }
}

export default ShareCandidateController