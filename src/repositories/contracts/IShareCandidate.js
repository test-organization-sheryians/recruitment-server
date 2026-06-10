class IShareCandidate {
    async createCandidate(data){
        throw Error("Method not implemented")
    }
    async shareCandidate (data){
        throw Error ("method not implemented")
    }
   
    // for update ,get, delete group
    async getCandidateById(id){
        throw Error ("method not implemented")
    }

    async getAllGroups(){
        throw Error ("method not implemented")
    }

    async updateGroup(id, data){
        throw Error ("method not implemented")
    }
    async deleteGroup(id){
        throw Error ("method not implemented")
    }

    async removeUserFromGroup(groupId, userId)
     { throw new Error('Method not implemented'); }


     async addUserToGroup(groupId, userId) {
         throw new Error('Method not implemented'); }

      async getSingleGroup(id){
        throw new Error('Method not implemented');
      }   


}

export default IShareCandidate