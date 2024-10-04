import React from "react";

const Sidebar = () => {
  return (
    <div
      className="h-screen md:w-72 
    hidden md:block fixed bg-blue-50 p-5 shadow-md"
    >
      <div className="flex justify-between items-center">
        {/* <Logo/>
            <NotifiationBox>
            <Bell className='h-5 w-5 text-gray-500'/>

            </NotifiationBox> */}
      </div>
      <hr className="my-5"></hr>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="font-medium">Workspace Name</h2>
          {/* <Button size="sm" className="text-lg" onClick={CreateNewDocument}>
                    {loading?<Loader2Icon className='h-4 w-4 animate-spin' />:'+'}
                    </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
