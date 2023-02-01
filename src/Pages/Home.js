import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from 'yup';
import FetchData from '../Hooks/FetchData'
import Header from '../Components/Header';

function Home() {

    return (
        <>
            <Header />
            <div class="container">
                <div class="d-flex justify-content-md-center align-items-center vh-100">
                    <div className="row w-75">
                        <div className="col p-2 ">

                            <div className="d-flex rounded justify-content-md-center align-items-center bg-white">
                                <div className="input-group input-group-lg">
                                    <input type="text" className="form-control" placeholder="Find a device by it`s AssetID" />
                                    <input type="image" src="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;