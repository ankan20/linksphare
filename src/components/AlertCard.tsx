'use client'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import React from "react";

const AlertCard = ({isAlertOpen,setIsAlertOpen,alertHeader,alertDescription,handleProceed}:{isAlertOpen:boolean,setIsAlertOpen:any,alertHeader:string,alertDescription:string,handleProceed:any}) => {
  return (
    <>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogHeader>{alertHeader}</AlertDialogHeader>
          <AlertDialogDescription>
            {alertDescription}
          </AlertDialogDescription>
          <div className="flex justify-end space-x-2">
            <AlertDialogCancel
              onClick={() => setIsAlertOpen(false)} // Close dialog if cancel
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleProceed} // Proceed with deletion
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AlertCard
