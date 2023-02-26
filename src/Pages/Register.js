
import FetchData from '../Hooks/FetchData'


function Register() {
    const [msg, setMsg] = ('')
    const sendEmail = () => {
        let httpMethod = 'post'
        let endpoint = 'email'
        let body = {
            "Email": {
                "To": 'arsalan.aptechnn@gmail.com',
                "Subject": 'DMS Test',
                "Content": '<h1>Test Email from DMS</h1>',
            }
        }

        FetchData(endpoint, httpMethod, body, (result) => {
            setMsg(result.data.message)
        })

    }
    return (
        <div className="container">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                            <div className="card mb-3">

                                <div className="card-body">

                                    {msg}
                                    <div className="col-12">
                                        <button className="btn btn-primary w-100" type="button" onClick={sendEmail}>Create Account</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}

export default Register;
