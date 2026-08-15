
import { UserStatus } from "./enums";
export interface UserResponseDto {
    id:number ;
    firstName:string ;
    lastName:string ;
    phoneNumber:string | null ;
    email:string ;
    createdDate:string ;
    hireDate:string ;
    status : UserStatus ;
    departementId:number | null ;
    roleId:number ;
    positionId:number | null ;

}