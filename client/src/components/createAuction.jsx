import React, { useState } from "react";
import { Input } from "./ui/input";
import { DatePicker } from "./datePicker";
import { Button } from "./ui/button";

const CreateAuction = () => {
  const [date, setDate] = useState();

  return (
    <div className="text-slate-800">
      <h1 className="text-4xl font-bold">Post an Item</h1>
      <form className="max-w-md flex flex-col gap-6">
        <Input type="text" placeholder="Name your item" />
        <Input type="number" placeholder="What to start your auction at" />
        <Input id="picture" type="file" />
        <DatePicker date={date} setDate={setDate} />
        <div className="flex justify-end">
          <Button>Post Item</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuction;
