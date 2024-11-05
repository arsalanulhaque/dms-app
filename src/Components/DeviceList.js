import '../style.css';
import iconInfo from '../assets/img/info_icon.png'
import iconWarning from '../assets/img/warning_icon.png'
import iconBasket from '../assets/img/basket_icon.png'

function DeviceList({ state, title, titleStyle, handleCheckout, handleCheckin, products }) {

    return (
        <div className='card border border-2 rounded mb-2'>
            <div className='card-header bg-light p-0 pt-2 px-2 fs-4 fst-italic text-success '>

                <div className="row">
                    <div className="col fst-italic">
                        <span class={titleStyle}>{title}</span>
                    </div>
                    {
                        state === 'available' ?
                            <div className="col-1 mt-2 mr-1">
                                <div className="fs-6 ">
                                    <img src={iconBasket} className="icon-28 position-relative" />
                                    <span class="position-absolute top-0  translate-middle badge rounded-pill bg-danger">{products.length}</span>
                                </div>
                            </div>
                            : ''
                    }
                </div>

            </div>
            <div className='card-body p-0 p-1'>
                {
                    products.map(product => {
                        return <div className={state === 'available' ? "card border border-1 border-success rounded mb-1" :
                            state === 'unavailable' ? "card border border-1 border-danger rounded mb-1 dim" :
                            state === 'return' ? "card border border-1 border-info rounded mb-1" :
                                "card border border-1 rounded mb-1"}>
                            <div className="card-header p-2">
                                <div className="row">
                                    <div className="col justify-content-end">
                                        <h5 className="text-dark">Asset# {product.AssetID}</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-0 px-2">
                                <div className="row p-1">
                                    <div className="col-6 card-text">Device Name: {product.DeviceName}</div>
                                    <div className="col-6 card-text">Model: {product.Model}</div>
                                </div>
                                <div className="row p-1">
                                    <div className="col-6 card-text">Staff: {product.Username === '' ? 'NA' : <span className="text-uppercase">{product.Username}</span>} </div>
                                    <div className="col-6 card-text">Taken On: {product.IssuedDate === null ? 'NA' : <span className="">{product.IssuedDate}</span>}</div>
                                </div>
                            </div>
                            {product?.IsIssued === 0 || state === 'return' ? '' :
                                <div className="card-footer">
                                    <div className="fst-italic">
                                        <img src={iconInfo} alt='' className="icon" /> This item was issued to <span className="fw-bold">{product.Username}</span>. Please raise the issue with IT Support!
                                    </div>
                                </div>
                            }
                        </div>
                    })
                }
            </div>
            <div className='card-footer p-1 m-1'>
                {state === 'unavailable' ?
                    <div className="fst-italic">
                        <img src={iconWarning} alt='' className="icon-28" /> <span className="text-danger">You are not permitted to keep any device prior to booking in the system!</span>
                    </div>
                    :
                    <div className="row ">
                        <div className="col fst-italic ">
                            <img src={iconInfo} alt='' className="icon-28" /> <span className={state === 'available' ? "text-success" : "text-info"}>Only, these devices will be {state === 'available' ? 'issued to' : 'returned by'} you!</span>
                        </div>
                        <div className="col-3 ">
                            {
                                state === 'available' ?
                                    <button type="button" alt='' className="btn btn-sm btn-success float-end" onClick={() => { handleCheckout() }}>Check-out</button>
                                    : state === 'return' ?
                                        <button type="button" alt='' className="btn btn-sm btn-info float-end" onClick={() => { handleCheckin() }}>Return</button>
                                        : ''
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default DeviceList;