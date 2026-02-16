import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TestResult, FeedbackEntry, AppointmentRequest, CustomerPublicView } from '../backend';

export function useGetContent(section: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['content', section],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getContent(section);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ section, content }: { section: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContent(section, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });
}

export function useGetTestResult(serialNumber: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TestResult | null>({
    queryKey: ['testResult', serialNumber],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTestResult(serialNumber);
    },
    enabled: !!actor && !isFetching && !!serialNumber,
  });
}

export function useUpdateTestResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: TestResult) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTestResult(
        result.serialNumber,
        result.cts,
        result.hivTests,
        result.platingTests,
        result.potherTests,
        result.hepatitisC,
        result.hepatitisB,
        result.rns,
        result.serialNumber2,
        result.coagulase,
        result.kbDisc,
        result.urineFullExam,
        result.additionalFieldName || null,
        result.additionalFieldValue || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testResult'] });
    },
  });
}

export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();

  return useQuery<FeedbackEntry[]>({
    queryKey: ['feedback'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ feedback, customerFirstName }: { feedback: string; customerFirstName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFeedbackEntry(feedback, customerFirstName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
    },
  });
}

export function useGetAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery<AppointmentRequest[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppointments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serialNumber, testType, appointmentDate }: { serialNumber: string; testType: string; appointmentDate: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAppointment(serialNumber, testType, appointmentDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<CustomerPublicView[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllCustomersPublicView();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomerCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['customerCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCustomerCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password, mobileNumber, email }: { username: string; password: string; mobileNumber: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCustomer(username, password, mobileNumber, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customerCount'] });
    },
  });
}

export function useRequestPasswordReset() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ mobileNumber, newPassword }: { mobileNumber: string; newPassword: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestPasswordReset(mobileNumber, newPassword);
    },
  });
}

export function useAddResetPasscode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ mobileNumber, passcode }: { mobileNumber: string; passcode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addResetPasscode(mobileNumber, passcode);
    },
  });
}

export function useVerifyResetPasscode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ mobileNumber, passcode }: { mobileNumber: string; passcode: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyResetPasscode(mobileNumber, passcode);
    },
  });
}

export function useFinalizePasswordReset() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (mobileNumber: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.finalizePasswordReset(mobileNumber);
    },
  });
}
