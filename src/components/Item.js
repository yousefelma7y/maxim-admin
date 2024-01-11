import React, { useEffect, useState, useReducer } from "react";
import './Admin.css'
import axios from "axios";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { validate, VALIDATOR_MINLENGTH } from "../util/validators";
import ErrorModal from "../LoadingSpinner/ErrorModal";
import RemoveCookie from '../hooks/removeCookie';
import { AiFillEdit } from "react-icons/ai";
import { RiArrowGoBackFill } from "react-icons/ri";

import { GiCoffeeBeans } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useParams } from "react-router-dom";

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

const Item = () => {

  const url = 'https://maxim-backend.onrender.com' ;


    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const [item, setItem] = useState([])

    const { id } = useParams();

    useEffect(() => {
        let timerId;
        if (loading) {
            setIsLoading(true);
            timerId = setTimeout(async () => {
                await axios.get(`${url}/menu/${id}`).then((res) => {
                    setItem(res.data.items)

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
        value: item.name,
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

    //price validation
    const [priceState, dispatch5] = useReducer(priceReducer, {
        value: item.price,
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

    const editItemHandler = async (event) => {
        event.preventDefault()
        // send api request to validate data
        setIsLoading(true);
        try {
            setError(null);
            const response = await axios.post(
                `${url}/menu/${id}`,
                {
                    name: NameState.value,
                    category: item.category,
                    price: priceState.value,
                }
            );
            const responseData = await response;
            if (!(response.statusText === "OK")) {
                throw new Error(responseData.data.message);
            }
            setError(responseData.data.message);
            setIsLoading(false);
            window.location.href = '/';

        } 
        catch (err) {
            setIsLoading(false);
            window.location.href = '/';
            // setError(err.message && "SomeThing Went Wrong , Please Try Again .");
        }
    };

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

            <div className="row w-100 p-0 m-0 justify-content-center">
                <div className="row w-100 p-0 m-0 justify-content-center">
                    <div className="back my-1">
                        <button className="back-btn p-3 " onClick={() => (window.location.href = '/')}>
                            <RiArrowGoBackFill className="fs-3" />
                        </button>
                    </div>
                    <form onSubmit={editItemHandler} className="p-0 m-0 row pt-3 mt-3 row " >

                        <div className='col-12 col-lg-5 m-1 py-2 p-0 '>
                            <label className='col-12 col-lg-5 fw-bold add-user-p py-2 drink-title'> الأسم :</label>
                            <input type='text' placeholder={item.name}
                                value={NameState.value}
                                onChange={NameChangeHandler}
                                onBlur={NameTouchHandler}
                                isvalid={NameState.isvalid.toString()}
                                className={`col-12 col-lg-7 search p-2 ${!NameState.isvalid &&
                                    NameState.isTouched &&
                                    "form-control-invalid"
                                    }`}
                            />
                        </div>

                        <div className='col-12 col-lg-5 m-1 py-2 p-0'>
                            <label className='col-12 col-lg-5 fw-bold add-user-p py-2 drink-title'>  السعر : </label>
                            <input type='number' placeholder={item.price}
                                value={priceState.value}
                                onChange={priceChangeHandler}
                                onBlur={pricetouchHandler}
                                isvalid={priceState.isvalid.toString()}
                                className={`col-12 col-lg-7 search p-2 ${!priceState.isvalid &&
                                    priceState.isTouched &&
                                    "form-control-invalid"
                                    }`}
                            />
                        </div>
                        <div className="pt-5">
                            <button className="cansel p-3"
                                disabled={
                                    !NameState.value ||
                                    !priceState.value
                                }
                            ><AiFillEdit className="fs-3" /> تعديل العنصر </button>
                        </div>
                    </form>
                </div>

            </div>
            </div>

        </div>
    )
}

export default Item
