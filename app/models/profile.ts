
export default interface Profile {
  id: string,
  name: string,
  shipping: {
    firstName: string
    lastName: string,
    address: string,
    address2: string,
    city: string,
    state: string,
    phone: string,
    country: string,
    postal: string,
  },
  isBillingSameAsShipping: boolean,
  billing: {
    firstName: string
    lastName: string,
    address: string,
    address2: string,
    city: string,
    state: string,
    phone: string,
    country: string,
    postal: string,
  },
  ccInfo: {
    number: string,
    name: string,
    expiry: string,
    cvv: string
  }
}
