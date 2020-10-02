


export const localdb:any = {}
console.info('Started in memory db')

export function addressHasComment(db:any, comment:string){
    for(let i=0; i<db.length; i++){
      console.log(db[i].comment)
      console.log(comment)
      if (db[i].comment == comment)
        return true
    }
    return false
  }