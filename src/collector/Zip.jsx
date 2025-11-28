import { useState } from "react";
import Collector from "./Collector";



export default function Zip() {
  const [active, setActive] = useState("profile");
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Collector 
      setActive={setActive} 
      active={active}
      showModal={showModal}
      setShowModal={setShowModal}
      />
      
    </div>
  )
}