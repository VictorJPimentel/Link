import React, { useEffect, useState, useRef } from 'react'
import Ticket from './Ticket';
import { query, collection, doc, onSnapshot, Timestamp } from 'firebase/firestore' 
import {db} from '../../firebase-config'
import { AiOutlineSend } from 'react-icons/ai'
import axios from 'axios';

function SMSFlyout(props: any) {
    const {
    } = props;

    const [assigned, setAssigned] = useState(true);

    const [tickets, setTickets] = useState([])
    const [ticket, setTicket] = useState(null)
    const [activeTicket, setActiveTicket] = useState(tickets[0]) 
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [message, setMessage] = useState("")
    const [body, setBody] = useState("")

    const assign = () => setAssigned(true);
    const unassign = () => setAssigned(false);


    const qActive = query(collection(db, "text-form"))

    const bodyRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
      const unsubscribe = onSnapshot(qActive, (querySnapshot) => {
        let data:any= [];
        querySnapshot.forEach((doc) => {
          if(!data.includes(doc.data())){
            data.push(doc.data());
          }
        });
        setTickets(data);  
      });
      return () => unsubscribe()
    }, []);

    function handleTicket(ticket){
      setName(ticket.full_name)
      setNumber(ticket.phone_number)
      setMessage(ticket.message)
    }

    const handleSubmit = async (e) => {
      e.preventDefault()

      setBody(bodyRef.current.value)

      const URL = "http://localhost:5000/text"

      await axios.post(`${URL}/text`, {
        body: bodyRef.current.value,
        number: number
      })
      
    }

    return (
        <div className="dashFlyout">
          <div className="dashFeature">
            <svg className="dashFeatureIcon" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26 17.6667C26 18.4034 25.7073 19.1099 25.1864 19.6309C24.6655 20.1518 23.9589 20.4444 23.2222 20.4444H6.55556L1 26V3.77778C1 3.04107 1.29266 2.33453 1.81359 1.81359C2.33453 1.29266 3.04107 1 3.77778 1H23.2222C23.9589 1 24.6655 1.29266 25.1864 1.81359C25.7073 2.33453 26 3.04107 26 3.77778V17.6667Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
    
            <div className="dashFeatureHeader _h1">SMS: Customer Queue</div>
            { assigned ?
              <>
                <button className="dashFeatureSub1 _h2" onClick={assign}><p>Assigned to you ◂</p></button>
                <button className="dashFeatureSub2 _h2 dashUnfocused" onClick={unassign}><p>Unassigned</p></button>
                <span className="dashFeatureLine" />
                <div className="dashFeatureBody _body">{tickets.length === 1 ? "1 conversation" : tickets.length + " conversations"} </div>
                <div className="dashFeatureType _h2">Chat</div>
                <div className="dashTickets">
                {tickets.map((ticket:any) => (
                  <Ticket active={ticket.resolved} name={ticket.full_name} message={ticket.message} createdAt={new Timestamp(ticket.createdAt?.seconds, ticket.createdAt?.nanoseconds).toDate().toLocaleDateString('en-US')} onClick={() => { handleTicket(ticket); } } />
                ))}
                </div>
              </>
            : 
              <>
                <button className="dashFeatureSub1 _h2 dashUnfocused" onClick={assign}><p>Assigned to you</p></button>
                <button className="dashFeatureSub2 _h2" onClick={unassign}><p>▸ Unassigned</p></button>
                <span className="dashFeatureLine" />
                <div className="dashFeatureBody _body">{unassignedTickets.length === 1 ? "1 conversation" : unassignedTickets.length + " conversations"} </div>
                <div className="dashFeatureType _h2">Chat</div>
                <div className="dashTickets">
                  {unassignedTickets.map((t : any) => (
                    <Ticket 
                      name={t.name}
                      message={t.userID} 
                      createdAt={new Timestamp(t.createdAt?.seconds, t.createdAt?.nanoseconds).toDate().toLocaleDateString('en-US')} 
                      onClick={ () => assignTicket(t) }
                    />
                  ))}
                </div>
              </>
            }
          </div>
    
          <div className="dashPanel">
            <div className="dashPanelBox">

              <div className="dashPanelHeader">
                <div className="dashPanelImage">
                  <img src={"https://picsum.photos/seed/" + ticket?.userID + "/300" }/> {/* Generates a new image using the userID as a seed */}
                </div>
                <div className="dashInfo">
                  <div className="dashInfoName _h2">{ticket?.name}</div>
                  <div className="dashInfoActive _h2">{ticket?.active == true ? "Ticket Active" : "Ticket Inactive"}</div>
                  <div className="dashInfoAddress _h2">2972 Westheimer Rd. Santa Ana, Illinois 85486</div>
                  <div className="dashInfoEmail _h2">Email: dianne.russell@mail.com</div>
                  <span className={"dashInfoDot " + (ticket?.active && "active")} />
                </div>
              </div>
              <div className="dashSection1">
                {message}
              </div>
              <div className="dashSection2">
                <textarea 
                  id="message" 
                  rows="4" 
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="Your message..."
                  ref={bodyRef}>

                  </textarea>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleSubmit}>Send Text <AiOutlineSend /> </button>
              </div>
            </div>
          </div>
        </div>
      );  
}

export default SMSFlyout
