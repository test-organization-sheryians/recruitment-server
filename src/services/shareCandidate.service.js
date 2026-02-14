import MongoShareCandidate from "../repositories/implementations/mongoShareCandidate.js";


class ShareCandidateService {
  constructor (){
    this.shareCandidateRepository = new MongoShareCandidate()
  }

  async createShareUsers (users){
        return await this.shareCandidateRepository.createCandidate(users)
  }
  async shareShareUser (shareId){
    return await this.shareCandidateRepository.shareCandidate(shareId)
  }
}

export default ShareCandidateService