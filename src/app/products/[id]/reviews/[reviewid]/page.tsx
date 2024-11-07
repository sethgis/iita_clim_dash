export default function ReviewDetails({params,}:{params: {id: string;
    reviewid:string;
}}){
    return <h1>Review {params.reviewid} for {params.id}</h1>
}

