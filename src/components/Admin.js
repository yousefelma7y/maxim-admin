import React, { useEffect, useState, useReducer } from "react";
import './Admin.css'
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { validate, VALIDATOR_MINLENGTH } from "../util/validators";
import ErrorModal from "../LoadingSpinner/ErrorModal";
import RemoveCookie from '../hooks/removeCookie';

import { GiCoffeeBeans } from "react-icons/gi";
import { MdPlaylistAddCheckCircle } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";

//Name validation
const NameReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.Name,
        isvalid: validate(action.Name, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};
//price validation
const priceReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.price,
        isvalid: validate(action.price, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Admin = () => {

  const url = 'https://maxim-backend.onrender.com' ;

  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [display, setDisplay] = useState(false);
  const [menu, setMenu] = useState([])

  useEffect(() => {
    let timerId;
    if (loading) {
      setIsLoading(true);
      timerId = setTimeout(async () => {
        await axios.get(url).then((res) => {
          setMenu(res.data.items)
        });
        setLoading(false);
        setIsLoading(false);
      });
    }
    return () => clearTimeout(timerId);
  }, [loading]);

  ////////////////////////////////////
  //Name validation
  const [NameState, dispatch2] = useReducer(NameReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const NameChangeHandler = (event) => {
    dispatch2({
      type: "CHANGE",
      Name: event.target.value,
      validators: [VALIDATOR_MINLENGTH(3)],
    });
  };
  const NameTouchHandler = () => {
    dispatch2({
      type: "TOUCH",
    });
  };

  //category value
  const [category, setCategory] = useState('');
  const categoryChangeHandler = (newOne) => {
    setCategory(newOne);
  };

  //price validation
  const [priceState, dispatch5] = useReducer(priceReducer, {
    value: "",
    isvalid: false,
    isTouched: false,
  });

  const priceChangeHandler = (event) => {
    dispatch5({
      type: "CHANGE",
      price: event.target.value,
      validators: [VALIDATOR_MINLENGTH(11)],
    });
  };
  const pricetouchHandler = () => {
    dispatch5({
      type: "TOUCH",
    });
  };
  //////////////////////////////////

  const addItemHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.post(
        `${url}/menu`,
        {
          name: NameState.value,
          category: category,
          price: priceState.value,
        }
      );
      const responseData = await response;

      if (!(response.statusText === "OK")) {
        throw new Error(responseData.data.message);
      }
      setError(responseData.data.message);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    }
  };

  const deleteItemHandler = async (id) => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await axios.delete(
        `${url}/menu/${id}`
      )
      const responseData = await response;

      setError(responseData.data.message);
      setIsLoading(false);
      window.location.href = '/';
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "SomeThing Went Wrong , Please Try Again .");
    };
  }


  function logout() {
    RemoveCookie("AdminToken");
    window.location.href = '/';
  }
  const errorHandler = () => {
    setError(null);
    window.location.reload(true);
  };

  return isLoading ? (
    <LoadingSpinner asOverlay />
  ) : (
    <div className="admin-page row w-100 p-0 m-0">
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay />}


      <div className="pt-1">
        <div className='row justify-content-end'>

          <div className="col-12  col-md-7 col-xl-4">
            <h1 className='admin-logo text-white  p-3 '>
              <GiCoffeeBeans /> MaXim Cafe <GiCoffeeBeans />
            </h1>
          </div>

          <div className='col-6 col-md-5'>
            <button onClick={logout}
              className="signout-btn p-3"><RiLogoutBoxRLine className="fs-3" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <div  className={display ? "p-0 m-0 row d-felx p-3" : 'd-none'} >
        <hr></hr>
          <div className='col-12 col-lg-5 m-1 py-2 p-0'>
            <label className='col-10 col-lg-5 fw-bold add-user-p py-2 drink-title'> الأسم :</label>
            <input type='text' placeholder='الأسم'
              value={NameState.value}
              onChange={NameChangeHandler}
              onBlur={NameTouchHandler}
              isvalid={NameState.isvalid.toString()}
              className={`col-10 col-lg-7 search p-2 ${!NameState.isvalid &&
                NameState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>

          <div className='col-12 col-lg-5 m-1 py-2 p-0'>
            <label className='col-10 col-lg-5 fw-bold add-user-p py-2 drink-title'>  النوع :</label>

            <select id="category" name="category" className="p-2 px-4 search col-10 col-lg-7" value={category}
              onChange={(event) => categoryChangeHandler(event.target.value)}>
              <option value="hot" className='text-secondary'>المشروبات الساخنه</option>
              <option value="cold" className='text-secondary'>المشروبات البارده</option>
              <option value="sweets" className='text-secondary'>الحلويات</option>
              <option value="cola" className='text-secondary'>المشروبات الغازبه</option>
              <option value="shisha" className='text-secondary'>الشيشه</option>
            </select>
          </div>

          <div className='col-12 col-lg-5 m-1 py-2 p-0'>
            <label className='col-10 col-lg-5 fw-bold add-user-p py-2 drink-title'>  السعر : </label>
            <input type='number' placeholder='السعر'
              value={priceState.value}
              onChange={priceChangeHandler}
              onBlur={pricetouchHandler}
              isvalid={priceState.isvalid.toString()}
              className={`col-10 col-lg-7 search p-2 ${!priceState.isvalid &&
                priceState.isTouched &&
                "form-control-invalid"
                }`}
            />
          </div>
          <div className="">
            <button className="show-form-btn p-3" onClick={addItemHandler}
              disabled={
                !NameState.value ||
                !category ||
                !priceState.value
              }
            ><MdPlaylistAddCheckCircle className="fs-3" /> إضافه عنصر جديد</button>
           <button className="cansle-btn p-3 mx-2" onClick={()=>setDisplay(!display)}><IoMdCloseCircle  className="fs-3" />إلغاء</button>
          </div>
          <hr className="mt-3"></hr>
        </div>

        <div className="row p-0 m-0">

          <div className={!display ? "d-flex col-8 col-md-6" : 'd-none'}>

            <button onClick={() => setDisplay(!display)}
              className="show-form-btn p-3"><MdPlaylistAddCheckCircle className="fs-3" />
              إضافه عنصر جديد
            </button>
          </div>

        </div>


      </div>

      <div className="fw-bold row w-100 p-0 m-0 justify-content-center">

        <div className="col-12 col-lg-5">
          <div className=' p-3'>
            <h4 className="drink-title">المشروبات الساخنة</h4>
            <div id="header-graphic" className="d-flex justify-content-center ">
              <div className="admin-creative-break ">
                <div className="left-diamond admin-diamond text-white "></div>
                <div className="right-diamond admin-diamond text-white"></div>
              </div>
            </div>
          </div>
          <div>
            {menu.map(item => (
              item.category == 'hot' ?
                <ul key={item._id}>
                  <li className="row p-0 m-0 w-100 justify-content-center">
                    <div className="col-2 p-0 m-0">
                      <button onClick={() => deleteItemHandler(item._id)}
                        className="delete p-1 px-2 "><RiDeleteBin5Fill />
                      </button>
                    </div>
                    <div className="col-6">
                      <a href={`/${item._id}`} className="text-white">{item.name}</a>
                    </div>
                    <div className="col-4">
                      {item.price}.00LE</div>
                  </li>
                </ul> : ''
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className=' p-3'>
            <h4 className="drink-title">المشروبات الباردة</h4>
            <div id="header-graphic" className="d-flex justify-content-center ">
              <div className="admin-creative-break ">
                <div className="left-diamond admin-diamond text-white "></div>
                <div className="right-diamond admin-diamond text-white"></div>
              </div>
            </div>
          </div>
          <div>
            {menu.map(item => (
              item.category == 'cold' ?
                <ul key={item._id}>
                  <li className="row p-0 m-0 w-100 justify-content-center">
                    <div className="col-2 p-0 m-0">
                      <button onClick={() => deleteItemHandler(item._id)}
                        className="delete p-1 px-2 "><RiDeleteBin5Fill />
                      </button>
                    </div>
                    <div className="col-6">
                      <a href={`/${item._id}`} className="text-white">{item.name}</a>
                    </div>
                    <div className="col-4">
                      {item.price}.00LE</div>
                  </li>
                </ul> : ''
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className=' p-3'>
            <h4 className="drink-title">المشروبات الغازية</h4>
            <div id="header-graphic" className="d-flex justify-content-center ">
              <div className="admin-creative-break ">
                <div className="left-diamond admin-diamond text-white "></div>
                <div className="right-diamond admin-diamond text-white"></div>
              </div>
            </div>
          </div>
          <div>
            {menu.map(item => (
              item.category == 'cola' ?
                <ul key={item._id}>
                  <li className="row p-0 m-0 w-100 justify-content-center">
                    <div className="col-2 p-0 m-0">
                      <button onClick={() => deleteItemHandler(item._id)}
                        className="delete p-1 px-2 "><RiDeleteBin5Fill />
                      </button>
                    </div>
                    <div className="col-6">
                      <a href={`/${item._id}`} className="text-white">{item.name}</a>
                    </div>
                    <div className="col-4">
                      {item.price}.00LE</div>
                  </li>
                </ul> : ''
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className=' p-3'>
            <h4 className="drink-title">الحلويات </h4>
            <div id="header-graphic" className="d-flex justify-content-center ">
              <div className="admin-creative-break ">
                <div className="left-diamond admin-diamond text-white "></div>
                <div className="right-diamond admin-diamond text-white"></div>
              </div>
            </div>
          </div>
          <div>
            {menu.map(item => (
              item.category == 'sweets' ?
                <ul key={item._id}>
                  <li className="row p-0 m-0 w-100 justify-content-center">
                    <div className="col-2 p-0 m-0">
                      <button onClick={() => deleteItemHandler(item._id)}
                        className="delete p-1 px-2 "><RiDeleteBin5Fill />
                      </button>
                    </div>
                    <div className="col-6">
                      <a href={`/${item._id}`} className="text-white">{item.name}</a>
                    </div>
                    <div className="col-4">
                      {item.price}.00LE</div>
                  </li>
                </ul> : ''
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className=' p-3'>
            <h4 className="drink-title">الشيشه </h4>
            <div id="header-graphic" className="d-flex justify-content-center ">
              <div className="admin-creative-break ">
                <div className="left-diamond admin-diamond text-white "></div>
                <div className="right-diamond admin-diamond text-white"></div>
              </div>
            </div>
          </div>
          <div>
            {menu.map(item => (
              item.category == 'shisha' ?
                <ul key={item._id}>
                  <li className="row p-0 m-0 w-100 justify-content-center">
                    <div className="col-2 p-0 m-0">
                      <button onClick={() => deleteItemHandler(item._id)}
                        className="delete p-1 px-2 "><RiDeleteBin5Fill />
                      </button>
                    </div>
                    <div className="col-6">
                      <a href={`/${item._id}`} className="text-white">{item.name}</a>
                    </div>
                    <div className="col-4">
                      {item.price}.00LE</div>
                  </li>
                </ul> : ''
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}

export default Admin
