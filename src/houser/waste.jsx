import { useState } from "react";
import Houser from "./Houser";



export default function HouserWaste() {
  const [active, setActive] = useState("profile");
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Houser 
      setActive={setActive} 
      active={active}
      showModal={showModal}
      setShowModal={setShowModal}
      />
      
    </div>
  )
}