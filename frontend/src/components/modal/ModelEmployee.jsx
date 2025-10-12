import React, { useState } from "react";

function ModelEmployee({ isOpen, isClose, employee, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    hire_date: "",
    status: 1,
    image: "",
  });

  const [getImage, setgetImage] = useState();
  const [prevImage, setPrevImage] = useState();

  return (
    <div>
      <div>{employee ? "Update Employee" : "Create New"}</div>

      <form action="">
        <div></div>
      </form>
    </div>
  );
}

export default ModelEmployee;
