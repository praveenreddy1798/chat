import React,{useState,useEffect,Fragment} from 'react'
import{Row,Col,Button,Image} from 'react-bootstrap'
import {gql,useQuery} from '@apollo/client'
import classNames from 'classnames'
import {useMessageDispatch,useMessageState} from '../../context/messages'


const GET_USERS = gql`
  query getUsers{
  getUsers{
    username imageUrl createdAt latestMessage{
      from to content createdAt uuid
    }
  }
}
  `


export default function User() {
    const dispatch = useMessageDispatch()
    const{users}=useMessageState()
    const { loading } = useQuery(GET_USERS,{
        onError(err){
            console.log(err)
        },
        onCompleted(data){
            dispatch({type:'SET_USERS',payload:data.getUsers})
            
        }

    })

    const selectedUser = users?.find((u)=>u.selected===true)?.username


    let usersMarkup
    if (!users || loading) {
      usersMarkup = <p>Loading..</p>
    } else if (users.length === 0) {
      usersMarkup = <p>No users have joined yet</p>
    } else if (users.length > 0) {
      usersMarkup = users.map((user) => {
          const selected = selectedUser===user.username
          
          return  (
        <div role="button" className={classNames("div-select d-flex p-3",{"bg-white":selected})} key={user.username} onClick={()=>dispatch({type:'SET_SELECTED_USERS',payload:user.username})}>
         <Image src={user.imageUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} className="mr-2 d-none d-md-block justify-content-center justify-content-md-start" style={{height:50 ,width:50,objectFit:"cover",borderRadius:"50%"}}/>
          <div>
          <p className="text-success m-0">{user.username}</p>
          <p className="font-weight-light m-0 text-break d-none d-md-block justify-content-center justify-content-md-start">
            {user.latestMessage ? user.latestMessage.content :'You are connected'}
          </p>
          </div>
         
        </div>
    
      ) })
          
    }

 

    return (
          <Col xs={3} md={4} className="p-0 bg-secondary add-messages" >
          {usersMarkup}
          </Col>
    )
}


