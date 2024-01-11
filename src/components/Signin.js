import React, {useReducer , useState } from 'react';
import SetCookie from '../hooks/setCookie';
import './Signin.css';

import { GiCoffeeBeans } from "react-icons/gi";

import { Form, Row } from "react-bootstrap";

import {validate  , VALIDATOR_REQUIRE ,VALIDATOR_MINLENGTH} from '../util/validators';

import ErrorModal from '../LoadingSpinner/ErrorModal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import axios from 'axios';

//EMAIL validation
const usernameReducer =(state , action) =>{
  switch(action.type){
    case 'CHANGE':
    return {
      ...state,
      value : action.username, 
      isvalid : validate(action.username , action.validators)
    };
    case 'TOUCH':
      return {
        ...state,       
        isTouched : true
      };
    default:
      return state ;
  }
}
//pass validation
const passReducer =(state , action) =>{
  switch(action.type){
    case 'CHANGE':
    return {
      ...state,
      value : action.pass, 
      isvalid : validate(action.pass , action.validators)
    };
    case 'TOUCH':
      return {
        ...state,       
        isTouched : true
      };
    default:
      return state ;
  }
}


const SignIn = () => {


//EMAIL validation 
const [usernameState , dispatch2 ]= useReducer(usernameReducer , {
  value:'' ,
  isvalid: false,
  isTouched :false
  });
  
  
const usernameChangeHandler = event =>{
  dispatch2({type:'CHANGE', username : event.target.value , validators: [VALIDATOR_MINLENGTH(3)] });
};
const touchHandler = () =>{
  dispatch2({
    type :'TOUCH'
  })
}

//PASS validation 
const [passState , dispatch3 ]= useReducer(passReducer , {
  value:'' ,
  isvalid: false,
  isTouched :false
  });
  
  
  const passChangeHandler = event =>{
    dispatch3({type:'CHANGE', pass : event.target.value , validators: [VALIDATOR_REQUIRE()] });
  };
  const passtouchHandler = () =>{
    dispatch3({
      type :'TOUCH'
    })
  }


const [isLoading ,setIsLoading] = useState(false);
const [error , setError] = useState(false);


const emailSubmitHandler = ()=>{
  setIsLoading(true);
   if( usernameState.value == 'maxim' && passState.value == '12345678' ){
      SetCookie("AdminToken" , 'token');
      setIsLoading(false);
      window.location.href = '/' ;
   }else {
    setIsLoading(false);
      alert('أسم المستخدم او كلمه السر غير صحيح .. برجاء المحاوله مره اخري')
    // setError("أسم المستخدم او كلمه السر غير صحيح .. برجاء المحاوله مره اخري");
   }

};

const errorHandler =() =>{
   setError(null) ;
}

  return (
    <div className='signin p-4 m-0 row justify-content-center w-100'>
      <div className='pt-5'>
        <div className='row justify-content-center'>
            <h1 className='logo text-white col-12 col-xl-5 col-md-7 p-3 '>
            <GiCoffeeBeans /> MaXim Cafe <GiCoffeeBeans />
            </h1>
        </div>
      <div className='col-12 p-3'>
        <h1 className='col-12 text-center m-0 p-0 title'> تسجيل الدخول </h1> 
          <div id="header-graphic" className="d-flex justify-content-center ">
              <div className="creative-break ">
                  <div className="left-diamond diamond text-white "></div>
                  <div className="right-diamond diamond text-white"></div> 
              </div>
          </div>
      </div>
      <Row className='col-12 p-0 m-0 justify-content-center '>
        <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && <LoadingSpinner asOverlay/>}
       <Form className="col-12 col-lg-6 m-0 p-0" onSubmit={emailSubmitHandler}>
          <Row className='w-100 justify-content-center m-0'>          
            <Form.Group  className= " col-md-10 col-12 text-center p-0" >
              <Form.Label className="lable fw-bold title p-3 fs-5"> <span style={{ color:'white'}}>*</span> أسم المستخدم <span style={{ color:'white'}}>*</span></Form.Label>
              <Form.Control
              controlid='username'
              value={usernameState.value}
              onChange={usernameChangeHandler}
              onBlur={touchHandler}
              isvalid={usernameState.isvalid.toString()}
              type='name'
              placeholder="User Name " 
              className={`p-3 ${!usernameState.isvalid && usernameState.isTouched && 'form-control-invalid' }`}/>
            {!usernameState.isvalid && usernameState.isTouched && <p style={{color:'red'}}>برجاء ادخال اسم مستخدم صحيح</p>}

            </Form.Group>

            <Form.Group className="mb-3 col-md-10 col-12 text-center p-0" controlId="formGridPassword">
              <Form.Label className="fw-bold title p-3 fs-5"><span style={{ color:'white'}}>*</span>كلمه السر <span style={{ color:'white'}}>*</span></Form.Label>
              <Form.Control
              controlid='password'
              value={passState.value}
              onChange={passChangeHandler}
              onBlur={passtouchHandler}
              isvalid={passState.isvalid.toString()}
              type="password" 
              placeholder="Password" 
              className={`p-3 ${!passState.isvalid && passState.isTouched && 'form-control-invalid' }`}
              />
            {!passState.isvalid && passState.isTouched && <p style={{color:'red'}}>برجاء ادخال كلمه سر صحيحة</p>}

            </Form.Group>

          </Row>
        <div className='row w-100 justify-content-center m-0'>

          <button     
            className='sign-btn fs-4 rounded col-md-4 col-6 fw-bold text-white p-3 my-3'
            disabled={!usernameState.isvalid || !passState.isvalid}
            type="submit"
            style={{ background:'#007063' ,  cursor: 'pointer' }}>
           دخول                            
          </button>

        </div>

      </Form>

    </Row>
    </div>
  </div>
  )
}

export default SignIn
