export  type CardHeadingType = {
    heading?: string
    title?: string
    text?: string
}

export  type BigCardBodyType = {
    img?:any
    toptext?: string
    text?: string
    numbertext?: string
    bottomtext?: string
}
export  type SmallCardBodyType = {
    img?:any
    text?: string
    bottomtext?: string
}

export type  ThreeItemCardProps ={
    header:CardHeadingType,
    title?: string
    data?:any,
  }

  export type  TwoItemCardProps ={
    // header:CardHeadingType,
    // item1:SmallCardBodyType,
    // item2:SmallCardBodyType,
    data?:any,
  }