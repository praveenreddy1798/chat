import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {useAuthState} from '../context/auth'
export default function DynamicRoute(props){
  const {user} = useAuthState()

  if(!user && props.authenticated){
      return  (
        <Redirect to ="/login" />
      ) 
      
  }
  if(user && props.guest){
    return  (
        <Redirect to ="/" />
      ) 
  }

  else{
      return (
          <Route component={props.component} {...props}/>
      )
  }
}