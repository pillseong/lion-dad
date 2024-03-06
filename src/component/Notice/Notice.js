import React from 'react';
import './Notice.css';
import Headers from'./headers/headers'
import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';


function Notice() {
  return (
    <div className='body_ang'>
     
      <MenuHeader />
     <Headers state='Curriculum'/>
     <LogoHeader />
      <hr className='line'></hr>

      <div className='main_container'>
        <div className='Common_main_container'>
          <h2 className='common'>Common</h2>
          <div className='common-box'>
            <h4 className='CSS'>CSS</h4>
            <h4 className='HTML'>HTML</h4>
            <h4 className='JS'>JS(기초)</h4>
          </div>
        </div>
        <div className='notice__line__contaner'>
          
          <div>
            <div className='line__2'> </div>
            <div className='line__2_1'>   </div>
            <div className='line__2_2'>   </div>
            <div className='v'></div>



            <div className='line__3'>   </div>
            <div className='line__3_1'>   </div>
            <div className='line__3_2'>   </div>
            <div className='v1'></div>


       


          </div>
        </div>

        <div className='right'>
          <div className='Back-group'>
          <h2 className='Back-End'>Back End</h2>
          <div className='Back-End-box'>
          <div className="Back-End-image1"></div>
          <div className="Back-End-image2"></div>
         <div className="Back-End-image3"></div>
              <h4 className='Python'>Python</h4>
              <h4 className='Django'>Django</h4>
              <h4 className='DRF'>DRF</h4>
            
          </div>
          </div>
          <div className='Front-group'>
          <h2 className='Front-End'>Front End</h2>
          <div className='Front-End-box'>
            <h4 className='js심화'>JS(심화)</h4>
            <h4 className='react'>React</h4>
            <h4 className='type'>TypeScript</h4>
          </div>
        </div>
        </div>
        </div>
        <div className='Design-box'>
          <h2 className='Design-Thinking'>Design-Thinking</h2>
          <h4 className='User'>User</h4>
          <h4 className='Branding'>Branding</h4>

      </div> 
      <div className='line__group'>
      <div className='line__4'></div>
      </div>
      <div className='v2'></div>
      <h2 className='Design-Tool'>Design Tool</h2>
    <div className='Tool-box'>
    <h4 className='Figma'>Figma</h4>
    <h4 className='Photoshop'>Photoshop</h4>
    <h4 className='IIIIustrator'>IIIIustrator</h4>
    </div>
  <div className='hidde__line'></div>
  </div>
  );
}

export default Notice;