import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface CustomerPublicView {
    username: string;
    mobileNumber: string;
}
export interface AppointmentRequest {
    testType: string;
    appointmentDate: string;
    serialNumber: string;
    requestTime: Time;
}
export interface FeedbackEntry {
    customerFirstName: string;
    feedback: string;
}
export interface UserProfile {
    name: string;
}
export interface TestResult {
    cts: bigint;
    rns: bigint;
    serialNumber2: string;
    urineFullExam: string;
    hivTests: bigint;
    potherTests: bigint;
    additionalFieldName?: string;
    hepatitisB: bigint;
    hepatitisC: bigint;
    kbDisc: string;
    serialNumber: string;
    additionalFieldValue?: string;
    platingTests: bigint;
    coagulase: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAppointment(serialNumber: string, testType: string, appointmentDate: string): Promise<void>;
    addCustomer(username: string, password: string, mobileNumber: string, email: string): Promise<void>;
    addFeedbackEntry(feedback: string, customerFirstName: string): Promise<void>;
    addResetPasscode(mobileNumber: string, passcode: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    finalizePasswordReset(mobileNumber: string): Promise<boolean>;
    getAllCustomersPublicView(): Promise<Array<CustomerPublicView>>;
    getAllEntries(): Promise<Array<FeedbackEntry>>;
    getAppointments(): Promise<Array<AppointmentRequest>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContent(section: string): Promise<string>;
    getCustomerCount(): Promise<bigint>;
    getTestResult(serialNumber: string): Promise<TestResult | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    requestPasswordReset(mobileNumber: string, newPassword: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateContent(section: string, content: string): Promise<void>;
    updateTestResult(serialNumber: string, cts: bigint, hivTests: bigint, platingTests: bigint, potherTests: bigint, hepatitisC: bigint, hepatitisB: bigint, rns: bigint, serialNumber2: string, coagulase: string, kbDisc: string, urineFullExam: string, additionalFieldName: string | null, additionalFieldValue: string | null): Promise<void>;
    verifyResetPasscode(mobileNumber: string, passcode: string): Promise<boolean>;
}
