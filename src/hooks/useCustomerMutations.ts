"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomer, getCustomers } from "@/app/actions/customer";

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { name: string; email: string; phone: string }) => {
            const formDataObj = new FormData();
            formDataObj.append("name", data.name);
            formDataObj.append("email", data.email);
            formDataObj.append("phone", data.phone);
            return createCustomer(formDataObj);
        },
        onSuccess: (result) => {
            if (result.success) {
                queryClient.invalidateQueries({ queryKey: ["customers"] });
            }
        },
    });
}

export function useCustomers() {
    return useQuery({
        queryKey: ["customers"],
        queryFn: getCustomers,
    });
}