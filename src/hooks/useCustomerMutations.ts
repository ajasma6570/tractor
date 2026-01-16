"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomerWithVehicle, getCustomers } from "@/app/actions/customer";
import { CreateCustomerInput } from "@/types/customer";

export function useCreateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCustomerInput) => createCustomerWithVehicle(data),
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
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}