import React,{ useState } from 'react'
import {Row,Col,Form,Button} from 'react-bootstrap'
import { gql,useLazyQuery } from '@apollo/client';
import {Link} from 'react-router-dom'
import {useAuthDispatch} from '../context/auth'
const LOGIN_USER = gql`
  query login(
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      username
      createdAt
      email
      token
    }
  }
`
const Login=(props)=>{
    const [variables,setVariables] = useState({
        password:'',username:''
      })
      const dispatch = useAuthDispatch()

      const[errors,setErrors]=useState({})

    const [loginUser, { loading }] = useLazyQuery(LOGIN_USER,{
      onError(err){
        // console.log(err.graphQLErrors[0].extensions.errors)
        setErrors(err.graphQLErrors[0].extensions.errors)
      },
      onCompleted(data){
          dispatch({type:'LOGIN',payload:data.login})
          window.location.href='/'
  }
})
    const loginForm = (e) =>{
      e.preventDefault()
      loginUser({variables})
      // console.log({variables})
    }
    return(
    <Row className="bg-white py-5 justify-content-center">
    <Col sm={8} md={6} lg={4}>

    <h1 className="text-center">Login</h1>
    <Form onSubmit={loginForm}>
<Form.Group >
<Form.Label className={errors.username && 'text-danger'}>{errors.username??'Username'}</Form.Label>
<Form.Control type="text" value={variables.username} className={errors.username &&'is-invalid'} onChange={(e)=>setVariables({...variables,username:e.target.value})} />
</Form.Group>
<Form.Group >
<Form.Label className={errors.password && 'text-danger'}>{errors.password ??'Password'}</Form.Label>
<Form.Control type="password" value={variables.password} className={errors.password && 'is-invalid'} onChange={(e)=>setVariables({...variables,password:e.target.value})} />
</Form.Group>
<div className="text-center">
<Button variant="success" type="submit" disabled={loading}>
{loading ? 'loading..' : 'Login'}
</Button>
<br />
<small>Don't have an account?<Link to ="/register">Register</Link></small>
</div>
</Form>
    </Col>
  </Row>
  )
}

export default Login