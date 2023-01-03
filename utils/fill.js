class apifeature{
    constructor(query,queryString){
        this.query=query;
        this.queryString=queryString;
    }
    fillter(){
        let que={ ...this.queryString };
        que=JSON.stringify(que);
       que=que.replace(/\b(gte|gt|lt|lte)\b/g,match=>`$${match}`);
       this.query=this.query.find(JSON.parse(que));
       return this;
    }
    sort(){
        if(this.queryString.sort){
            const tem=this.queryString.sort.split(',').join(" ");
            this.query=this.query.sort(tem)
        }else {
            this.query = this.query.sort('-createdAt');
          }
        return this;
    }
    select(){
        if(this.queryString.feilds){
            const tt=this.queryString.feilds.split(",").join(" ");
            this.query=this.query.select(tt);
            return this;
        }
    }
    pagination(){
        let page=this.queryString.page*1||1;
        let limit=this.queryString.limit*1||10;
        let skip=(page-1)*limit;
this.query=this.query.skip(skip).limit(limit);
return this;
    }


}
module.exports=apifeature;