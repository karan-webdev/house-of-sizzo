// import React, { useState } from "react";

// export interface CheckoutFormProps {
//   onSubmit: (data: { name: string; email: string; address: string }) => void;
// }

// const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit({ name, email, address });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
//       <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-2"/>
//       <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2"/>
//       <textarea placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} className="border p-2"/>
//       <button type="submit" className="bg-blue-600 text-white p-2 rounded">Checkout</button>
//     </form>
//   );
// };

// export default CheckoutForm;
