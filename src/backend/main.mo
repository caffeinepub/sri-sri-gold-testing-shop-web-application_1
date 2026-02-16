import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module TestResult {
    public func compare(result1 : TestResult, result2 : TestResult) : Order.Order {
      Text.compare(result1.serialNumber, result2.serialNumber);
    };
  };

  module FeedbackEntry {
    public func compare(entry1 : FeedbackEntry, entry2 : FeedbackEntry) : Order.Order {
      switch (Text.compare(entry1.customerFirstName, entry2.customerFirstName)) {
        case (#equal) { Text.compare(entry2.feedback, entry1.feedback) };
        case order {
          if (entry1.customerFirstName == "" or entry1.customerFirstName == " " or entry1.customerFirstName == "  ") {
            #greater;
          } else if (entry2.customerFirstName == "" or entry2.customerFirstName == " " or entry2.customerFirstName == "  ") {
            #less;
          } else {
            order;
          };
        };
      };
    };
  };

  module AppointmentRequest {
    public func compare(request1 : AppointmentRequest, request2 : AppointmentRequest) : Order.Order {
      switch (Int.compare(request1.requestTime, request2.requestTime)) {
        case (#equal) { Text.compare(request1.serialNumber, request2.serialNumber) };
        case (order) { order };
      };
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var contentUpdates : [(Text, Text)] = [
    ("welcomeMessage", "Welcome to HetLab! Open all day 24/7."),
    ("aboutUs", "HetLab is your trusted partner for accurate and timely test results. Our laboratory is open 24/7 to serve your needs."),
    ("services", "We offer a wide range of diagnostic services, including CTS, HIV tests, plating tests, and more."),
  ];

  var feedbackEntries : [FeedbackEntry] = [];
  var testResultsArray : [TestResult] = [];
  var appointmentRequests : [AppointmentRequest] = [];
  var resetPasscodes : [(Text, Text)] = [];
  var pendingPasswordResets : [(Text, (Text, Time.Time))] = [];
  let customers = Map.empty<Text, Customer>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  type Customer = {
    username : Text;
    password : Text;
    mobileNumber : Text;
    email : Text;
    registrationDate : Time.Time;
  };

  type TestResult = {
    serialNumber : Text;
    cts : Int;
    hivTests : Int;
    platingTests : Int;
    potherTests : Int;
    hepatitisC : Int;
    hepatitisB : Int;
    rns : Int;
    serialNumber2 : Text;
    coagulase : Text;
    kbDisc : Text;
    urineFullExam : Text;
    additionalFieldName : ?Text;
    additionalFieldValue : ?Text;
  };

  type FeedbackEntry = {
    feedback : Text;
    customerFirstName : Text;
  };

  type AppointmentRequest = {
    serialNumber : Text;
    testType : Text;
    appointmentDate : Text;
    requestTime : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func addCustomer(username : Text, password : Text, mobileNumber : Text, email : Text) : async () {
    let newCustomer : Customer = {
      username;
      password;
      mobileNumber;
      registrationDate = Time.now();
      email;
    };
    customers.add(username, newCustomer);
  };

  public shared ({ caller }) func updateContent(section : Text, content : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    let filtered = contentUpdates.filter(func((s, _)) { s != section });
    contentUpdates := filtered.concat([(section, content)]);
  };

  public query ({ caller }) func getContent(section : Text) : async Text {
    switch (contentUpdates.find(func((key, _)) { key == section })) {
      case (?found) { found.1 };
      case (null) { Runtime.trap("Content section not found") };
    };
  };

  public shared ({ caller }) func updateTestResult(
    serialNumber : Text,
    cts : Int,
    hivTests : Int,
    platingTests : Int,
    potherTests : Int,
    hepatitisC : Int,
    hepatitisB : Int,
    rns : Int,
    serialNumber2 : Text,
    coagulase : Text,
    kbDisc : Text,
    urineFullExam : Text,
    additionalFieldName : ?Text,
    additionalFieldValue : ?Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update test results");
    };
    let newResult : TestResult = {
      serialNumber;
      cts;
      hivTests;
      platingTests;
      potherTests;
      hepatitisC;
      hepatitisB;
      rns;
      serialNumber2;
      coagulase;
      kbDisc;
      urineFullExam;
      additionalFieldName;
      additionalFieldValue;
    };
    testResultsArray := testResultsArray.filter(func(result) { result.serialNumber != serialNumber });
    testResultsArray := testResultsArray.concat([newResult]);
  };

  public query ({ caller }) func getTestResult(serialNumber : Text) : async ?TestResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view test results");
    };
    testResultsArray.find(func(result) { result.serialNumber == serialNumber });
  };

  public query ({ caller }) func getAllEntries() : async [FeedbackEntry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all feedback");
    };
    feedbackEntries.sort();
  };

  public shared ({ caller }) func addFeedbackEntry(feedback : Text, customerFirstName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit feedback");
    };
    let newEntry : FeedbackEntry = {
      feedback;
      customerFirstName;
    };
    feedbackEntries := feedbackEntries.concat([newEntry]);
  };

  public query ({ caller }) func getAppointments() : async [AppointmentRequest] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all appointments");
    };
    appointmentRequests.sort();
  };

  public shared ({ caller }) func addAppointment(serialNumber : Text, testType : Text, appointmentDate : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can book appointments");
    };
    let newAppointment : AppointmentRequest = {
      serialNumber;
      testType;
      appointmentDate;
      requestTime = Time.now();
    };
    appointmentRequests := appointmentRequests.concat([newAppointment]);
  };

  public shared ({ caller }) func requestPasswordReset(mobileNumber : Text, newPassword : Text) : async () {
    let timestamp = Time.now();
    pendingPasswordResets := pendingPasswordResets.filter(func((number, _)) { number != mobileNumber });
    pendingPasswordResets := pendingPasswordResets.concat([(mobileNumber, (newPassword, timestamp))]);
  };

  public type CustomerPublicView = {
    username : Text;
    mobileNumber : Text;
  };

  public query ({ caller }) func getAllCustomersPublicView() : async [CustomerPublicView] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view customer list");
    };
    customers.values().toArray().map(func(customer) { { username = customer.username; mobileNumber = customer.mobileNumber } });
  };

  public query ({ caller }) func getCustomerCount() : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view customer count");
    };
    customers.size();
  };

  public shared ({ caller }) func addResetPasscode(mobileNumber : Text, passcode : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can generate reset passcodes");
    };
    resetPasscodes := resetPasscodes.filter(func((number, _)) { number != mobileNumber });
    resetPasscodes := resetPasscodes.concat([(mobileNumber, passcode)]);
  };

  public shared ({ caller }) func verifyResetPasscode(mobileNumber : Text, passcode : Text) : async Bool {
    switch (resetPasscodes.find(func((number, _)) { number == mobileNumber })) {
      case (?found) { found.1 == passcode };
      case (null) { false };
    };
  };

  public shared ({ caller }) func finalizePasswordReset(mobileNumber : Text) : async Bool {
    switch (pendingPasswordResets.find(func((number, _)) { number == mobileNumber })) {
      case (?found) {
        let (_, timestamp) = found.1;
        let now = Time.now();
        let fiveMinutes = 300_000_000_000; // 5 minutes in 100 ns
        let allowedTime = timestamp + fiveMinutes;
        pendingPasswordResets := pendingPasswordResets.filter(func((number, _)) { number != mobileNumber });
        now >= allowedTime;
      };
      case (null) { false };
    };
  };
};
