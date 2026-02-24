class IshareCandidate {
    async createCandidate(data){
        throw Error("Method not implemented")
    }
    async shareCandidate (data){
        throw Error ("method not impleneted")
    }
   
    // for update ,get, delete group
    async getCandiateById(id){
        throw Error ("method not implemented")
    }

    async getAllGroups(){
        throw Error ("method not impleneted")
    }

    async updateGroup(id, data){
        throw Error ("method not impleneted")
    }
    async deleteGroup(id){
        throw Error ("method not impleneted")
    }

    async removeUserFromGroup(groupId, userId)
     { throw new Error('Method not implemented'); }


     async addUserToGroup(groupId, userId) {
         throw new Error('Method not implemented'); }

      async getSingleGroup(id){
        throw new Error('Method not implemented');
      }   


}

export default IshareCandidate