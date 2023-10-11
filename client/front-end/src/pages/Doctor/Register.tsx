import React, {useState,ChangeEvent} from 'react';
import axios from "axios";
import { IonIcon } from '@ionic/react';

const steps = [
    {id: 1, title:'Personal Info', fields: ['Name','Date of Birth', 'Speciality']},
    {id: 2, title:'Logging Info', fields: ['Username', 'Password', 'Email']},
    {id: 3, title:'Professional Info', fields: ['Hourly Rate', 'Affiliation', 'Educational Background']},
];

function Register(){
    const [activeForm, setActiveForm] = useState(1);
    const [modalActive, setModalActive] = useState(false);
    const [Name, setName] = useState<string>("");
    const [Email, setEmail] = useState<string>("");
    const [Password, sePassword] = useState<string>("");
    const [Username, setUsername] = useState<string>("");
    const [HourlyRate, setHourlyRate] = useState<Number>();
    const [Dob, setDob] = useState<Date>();
    const [Affiliation, setAffiliation] = useState<string>("");
    const [EducationalBackground, setEducation] = useState<string>("");
    const [Specialty, setSpecialty] = useState<string>("");


    const api = axios.create({
      baseURL: "http://localhost:8000/",
  });

    const handleSignUp = async () => {
      try {
        const data = {
          Name,
          Email,
          Password,
          Username,
          Dob,
          HourlyRate,
          Affiliation,
          EducationalBackground,
          Specialty
  
        };
        
       
        const response = await api.post(`/doctor/register`, data);
        console.log("Response:", response.data);
        setModalActive(true);
        setTimeout(closeModal,1500)
       
      } catch (error) {
        console.error("Error:", error);
      }
    };


    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
      };
      
      const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
      };
      const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        sePassword(event.target.value);
      };
      const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
      };
      const handleSpecialtyChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSpecialty(event.target.value);
      };
      const handleHourRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const parsedValue = parseFloat(inputValue); // Parse the input string to an integer
    
        if (!isNaN(parsedValue)) {
            setHourlyRate(parsedValue);
        } else {
            setHourlyRate(undefined); // Invalid input, clear the value
        }
      };
      const handleDobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value; // Assuming the input format is "YYYY-MM-DD"
        const date = new Date(inputValue);
 
        if (!isNaN(date.getTime())) {
            setDob(date);
          } else {
            setDob(undefined); // Invalid input, clear the date
          }
        };
        const handleAffiliationChange = (event: ChangeEvent<HTMLInputElement>) => {
            setAffiliation(event.target.value);
        };
        const handleEducationchange = (event: ChangeEvent<HTMLInputElement>) => {
            setEducation(event.target.value);
        };

    
    const handleNext = () => {
      if (activeForm < steps.length) {
        setActiveForm(activeForm + 1);
      }
    };
  
    const handleBack = () => {
      if (activeForm > 1) {
        setActiveForm(activeForm - 1);
      }
    };
  
  
    const closeModal = () => {
      setModalActive(false);
    };
 
   
    return (
    <div className="wrapper">
        <div className="header">
              <h1 className='h1'>Apply to become a doctor</h1>
      </div>


      <div className="wrapper">
        <div className="header">

          <ul>
              <li key={1} className={`form_${1}_progessbar ${activeForm >= 1 ? 'active' : ''}`}>
                <div>
                  <p>{1}</p>
                </div>
              </li>
          
          </ul>
          
          <ul>
              <li key={2} className={`form_${2}_progessbar ${activeForm >= 2 ? 'active' : ''}`}>
                <div>
                  <p>{2}</p>
                </div>
              </li>
          
          </ul>
          
          <ul>
              <li key={3} className={`form_${3}_progessbar ${activeForm >= 3 ? 'active' : ''}`}>
                <div>
                  <p>{3}</p>
                </div>
              </li>
          
          </ul>
        </div>

        <div className="form_wrap">
          
            <div key={1} className={`form_1 data_info`} style={{ display: activeForm === 1 ? 'block' : 'none' }}>
              <h2>{"Personal Info"}</h2>
              <form>
                <div className="form_container">
                
    <div key= "1" className="input_wrap">
      <label htmlFor="Name">Name</label>
      <input
        className="input"
        value = {Name}
        onChange={handleNameChange}
        type="text"/>
                    </div>


                    <div key= "2" className="input_wrap">
      <label htmlFor="Name">Date of Birth</label>
      <input
        className="input"
        value = {Dob !== undefined ? Dob.toISOString().split('T')[0] : ''}
        onChange={handleDobChange}
        type="date  "/>
                    </div>


                    <div key= "3 " className="input_wrap">
      <label htmlFor="Name">Specialty</label>
      <input
        className="input"
        value = {Specialty}
        onChange={handleSpecialtyChange}
        type="text"/>
                    </div>
                    
                </div>
              </form>
            </div>
        </div>


<div className="form_wrap">
          
            <div key={2} className={`form_2 data_info`} style={{ display: activeForm === 2 ? 'block' : 'none' }}>
              <h2>{"Logging Info"}</h2>
              <form>
                <div className="form_container">
                
    <div key= "1" className="input_wrap">
      <label htmlFor="Username">Username</label>
      <input
        className="input"
        value = {Username}
        onChange={handleUsernameChange}
        type="text"/>
                    </div>


                    <div key= "2" className="input_wrap">
      <label htmlFor="Name">Password</label>
      <input
        className="input"
        value = {Password}
        onChange={handlePasswordChange}
        type="text"/>
                    </div>


                    <div key= "3 " className="input_wrap">
      <label htmlFor="Name">Email</label>
      <input
        className="input"
        value = {Email}
        onChange={handleEmailChange}
        type="text"/>
                    </div>
                    
                </div>
              </form>
            </div>
        </div>


        <div className="form_wrap">
          
          <div key={3} className={`form_3 data_info`} style={{ display: activeForm === 3 ? 'block' : 'none' }}>
            <h2>{"Professional Info"}</h2>
            <form>
              <div className="form_container">
              
  <div key= "1" className="input_wrap">
    <label htmlFor="HourRate">Hourly Rate</label>
    <input
      className="input"
      value = {HourlyRate !== undefined ? HourlyRate.toString() : ''}
      onChange={handleHourRateChange}
      type="text"/>
                  </div>


                  <div key= "2" className="input_wrap">
    <label htmlFor="Afilliation">Afilliation</label>
    <input
      className="input"
      value = {Affiliation}
      onChange={handleAffiliationChange}
      type="text"/>
                  </div>


                  <div key= "3 " className="input_wrap">
    <label htmlFor="Education">Educational Background</label>
    <input
      className="input"
      value = {EducationalBackground}
      onChange={handleEducationchange}
      type="text"/>
                  </div>
                  
              </div>
            </form>
          </div>
      </div>


        <div className="btns_wrap">
          <div className={`common_btns form_${activeForm}_btns`}>
            {activeForm !== 1 && (
              <button type="button" className="btn_back" onClick={handleBack}>
                <span className="icon"><IonIcon name="arrow-back-sharp"></IonIcon></span>
                Back
              </button>
            )}
            {activeForm !== steps.length ? (
              <button type="button" className="btn_next" onClick={handleNext}>
                Next <span className="icon"><IonIcon name="arrow-forward-sharp"></IonIcon></span>
              </button>
            ) : (
              <button type="button" className="btn_done" onClick={handleSignUp}>
                Submit
                
              </button>
            )}
          </div>
        </div>
        <div className={`modal_wrapper ${modalActive ? 'active' : ''}`}>
          <div className="shadow"  ></div>
          <div className="success_wrap">
            <span className="modal_icon"><IonIcon name="checkmark-sharp"></IonIcon></span>
            <p>You have successfully completed the process.</p>
            <IonIcon name="close-outline" onClick={closeModal}></IonIcon>
          </div>
          
        </div>
      </div>
      </div>
    );
  }
  
export default Register;
