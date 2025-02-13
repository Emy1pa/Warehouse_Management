import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticateUser } from "../../app/services/authService";

jest.mock("axios");
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn().mockResolvedValue("some secret key"), // Default value to be returned by getItem
  setItem: jest.fn().mockResolvedValue(true),
}));
describe("authenticateUser", () => {
  let setMessageMock;
  let routerMock;

  beforeEach(() => {
    setMessageMock = jest.fn();
    routerMock = {
      push: jest.fn(),
    };
    axios.get.mockResolvedValue({
      data: [{ secretKey: "validSecretKey" }],
    });
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it("should set success message and redirect when secret key is correct", async () => {
    await authenticateUser("validSecretKey", setMessageMock, routerMock);

    expect(setMessageMock).toHaveBeenCalledWith({
      text: "Login successful! Redirecting...",
      color: "text-green-500",
    });
    jest.advanceTimersByTime(1500);
    expect(routerMock.push).toHaveBeenCalledWith("/(products)/products");

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "userSecretKey",
      "validSecretKey"
    );
  });

  it("should set error message when secret key is empty", async () => {
    await authenticateUser("", setMessageMock, routerMock);

    expect(setMessageMock).toHaveBeenCalledWith({
      text: "Secret Key cannot be empty!",
      color: "text-red-500",
    });

    expect(axios.get).not.toHaveBeenCalled();
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it("should set error message when secret key is invalid", async () => {
    axios.get.mockResolvedValue({
      data: [{ secretKey: "validSecretKey" }],
    });

    await authenticateUser("invalidSecretKey", setMessageMock, routerMock);

    expect(setMessageMock).toHaveBeenCalledWith({
      text: "Invalid secret key, please try again.",
      color: "text-red-500",
    });

    expect(routerMock.push).not.toHaveBeenCalled();
  });
});
