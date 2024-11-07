import './navbar.css'

import Image from 'next/image'

// maps API Key for google maps: AIzaSyCzP45TPEccPMHHj53NN2x-TfWS9igYSx4

export default function Navbar(){
    return (
        <nav className='navbar'>
            <div className='navbar_div'>
                {/* <img src = {img} alt='logo' className='navbar-logo' /> */}
                <Image src={`/IITA.png`} alt="logo" width="64" height="64" className="navbar-logo" />
                <h1 className='navbar-title'>IITA Climate Analytics Modeling</h1>
                {/* <ul className='navcomponents'>
                    <li><a href="/">cflo profile</a></li>
                    <li><a href="/onboard">cflo onboarding</a></li>
                    <li><a href="/about">cflo contacts</a></li>
                    <li><a href="/services">cflo-services</a></li>
                    <li><a href="/contact">cflo-team</a></li>
                </ul> */}
            </div>
        </nav>
        // <nav className='navbar'>
            
        //     <div className='navbar_div'>
        //         <h1 className='navbar-title'>Carbonflo Services</h1>
        //         <ul className='navcomponents'>
        //             <li><a href="/">Home</a></li>
        //             <li><a href="/about">About</a></li>
        //             <li><a href="/services">Services</a></li>
        //             <li><a href="/contact">Contact</a></li>
        //         </ul>
                
        //     </div>

            
            
        // </nav>
       
    )
}
