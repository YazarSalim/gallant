"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "../utils/validation";
import toast from "react-hot-toast";
import Button from "./Button";
import Input from "./Input";
import {
  createClient,
  updateClient,
} from "@/services/clientServices.ts/client";
import { ClientFormValues } from "@/types/types";

interface ClientFormProps {
  onClose: () => void;
  onUpdate: () => void;
  initialData?: ClientFormValues;
}

const ClientForm: React.FC<ClientFormProps> = ({
  onClose,
  onUpdate,
  initialData,
}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      clientName: "",
      clientCode: "",
      contact: "",
    },
  });


  const isEditMode = !!initialData;
  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);
  const handleOnSubmit = async (data: ClientFormValues) => {
    try {
      let response;
      if (initialData?.id) {
        response = await updateClient(initialData.id, data);
        if (!response.data.success) {
          toast.error(response.data.message);
          return;
        }
        toast.success(response.data.message);
      } else {
        response = await createClient(data);
        if (!response.data.success) {
          toast.error(response.data.message);
        }
         toast.success(response.data.message);
      }
      onUpdate();
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      console.log(error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        {initialData?.id ? "Edit Client" : "Add Client"}
      </h2>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Client Code"
              disabled={isEditMode}
              {...register("clientCode")}
              error={errors.clientCode?.message}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Client Name"
              {...register("clientName")}
              error={errors.clientCode?.message}
            />
            {/* <input
              type="text"
              placeholder="Client Name"
              {...register("clientName")}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.clientName.message}
              </p>
            )} */}
          </div>
        </div>
        <div>
          <Input
            type="text"
            placeholder="Client Contact"
            {...register("contact")}
            error={errors.clientCode?.message}
          />
          {/* <input
            type="text"
            placeholder="Client Contact"
            {...register("contact")}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
          />
          {errors.contact && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contact.message}
            </p>
          )} */}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          {/* <button
            type="button"
            onClick={() => onClose()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            Cancel
          </button> */}

          <Button
            type="button"
            onClick={onClose}
            variant="custom"
            className="bg-black text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          {/* <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button> */}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
