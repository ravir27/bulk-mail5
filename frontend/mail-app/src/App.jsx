import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("");
  const [status,setstatus] = useState(false)
  const [emailList,setemailList] = useState([])

  function handlemsg(evt)
   {
  setmsg(evt.target.value)   
  }

  function handlefile(event) {
       const file = event.target.files[0]
   
    const reader = new FileReader()

    reader.onload = function(event){
        const data = event.target.result
        const workbook = XLSX.read(data,{type:"binary"})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail = emailList.map(function(item){return item.A})
        console.log(totalemail);
        setemailList(totalemail)
        
    }
    reader.readAsBinaryString(file) 
  }

  function send() 
  {
    setstatus(true)
    axios.post("http://localhost:5000/sendemail",{msg:msg,emailList:emailList})

    .then(function(data){
      if(data.data ===true){
        alert("Email Sent Successfully")
        setstatus(false)
      }
      else{
        alert("Failed")
      }
    })
  }

  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
        <h2 className="px-5 py-3 font-medium text-2xl">Bulk mail</h2>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h2 className="px-5 py-3 font-medium">
          We can help your business with sending emails at once
        </h2>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h2 className="px-5 py-3 font-medium">Drag and Drop</h2>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
        <textarea
          onChange={handlemsg}
          value={msg}
          className="w-[80%] h-32 py-2 outline-none px-2 bg-white border-black rounded-md"
          placeholder="Enter the email text...."
        ></textarea>

        <div>
          <input
            type="file"
            onChange={handlefile}
            accept=".xlsx, .xls"
            className="border-4 text-black font-bold border-black border-dashed py-4 px-5 my-5"
          />
        </div>

        <p>Total emails in the file:{emailList.length}</p>

        <button
          onClick={send}
          className="bg-black text-white px-4 py-2 border rounded-md my-3"
        >
          {status ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="bg-blue-200 text-white text-center">
        <h2 className="py-14 font-medium"></h2>
      </div>

      <div className="bg-blue-100 text-white text-center">
        <h2 className="py-14 font-medium"></h2>
      </div>
    </div>
  );
}

export default App;
