import React from 'react';
import { AiOutlineFrown } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Button} from "antd";


const Endpoint = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center text-black text-3xl mt-32 mb-32">
      <AiOutlineFrown className="mx-auto text-4xl mb-4 h-20 w-20" />
      <p className="font-bold">Oops! The page you are looking for does not exist.</p>
      <Button onClick={() => navigate('/')} className="mt-4 font-bold text-xl border-2 border-black rounded-full px-4 py-2 mb-8">
        Back to Home
      </Button>
    </div>
  );
};

export default Endpoint;
