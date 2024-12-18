import './navbar.css'

import Image from 'next/image'

// maps API Key for google maps: AIzaSyCzP45TPEccPMHHj53NN2x-TfWS9igYSx4

export default function Navbar(){
    return (
        <nav className='navbar'>
            <div className='navbar_div'>
                {/* <img src = {img} alt='logo' className='navbar-logo' /> */}
                <Image src={`/IITA.png`} alt="logo" width="64" height="64" className="navbar-logo" />
                <Image src={`/MIXED2.png`} alt="logo" width="64" height="64" className="navbar-logo3" />
                <h1 className='navbar-title'>IITA - Spatial Information Repository</h1>
                <ul className='navcomponents'>
                    <li><a href="https://www.cgiar.org/food-security-impact/" target="_blank" rel="noopener noreferrer">About Us</a></li>
                    <li><a href="https://www.cgiar.org/" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
                    <li><a href="https://www.cgiar.org/how-we-work/" target="_blank" rel="noopener noreferrer">Our Work</a></li>
                    <li><a href="https://www.cgiar.org/funders/" target="_blank" rel="noopener noreferrer">Our Partners</a></li>
                </ul>
                <Image src={`/CGIAR.png`} alt="logo" width="64" height="64" className="navbar-logo2" />
            </div>
        </nav>
       
       
    )
}
