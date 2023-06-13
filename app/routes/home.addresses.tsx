import { Link, Outlet, useActionData, useLoaderData, useSearchParams } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { createOrUpdateUser, getUserByPhone } from "~/utils/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { useState, useEffect } from "react"

import { getUserAddresses } from "~/utils/address.query.server"
import { Address } from "@prisma/client"
export const action = async ({ request }: any) => {
  try {
    await requirePhoneNumber(request)

    const form = await request.formData()
    const phoneNumber = form.get("phoneNumber")
    const firstName = form.get("firstName")
    const lastName = form.get("lastName")
    const gender = form.get("gender")
    const birthday = form.get("birthday")
    const email = form.get("email")(gender)

    const user = await createOrUpdateUser({
      phoneNumber,
      firstName,
      lastName,
      gender,
      birthday,
      email,
    })
    if (user) return { successful: true }
    return { unsuccessful: true }
  } catch (error) {
    return {
      unsuccessful: true,
    }
  }
}

export const loader = async ({
  request,
}: LoaderArgs): Promise<Address[] | null> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("User Is Not Verified Or Suspended")
    }

    const addresses = await getUserAddresses({ phoneNumber })
    return addresses
  } catch (error) {
    throw error
  }
}

export default function UserInfo() {
  const addresses = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()

  //   const [firstName, setFirstName] = useState(loaderData.user.firstName)
  //   const [lastName, setLastName] = useState(loaderData.user.lastName)
  //   const [gender, setGender] = useState(loaderData.user.gender)
  //   const [birthday, setBirthday] = useState(loaderData.user.birthday)
  //   const [email, setEmail] = useState(loaderData.user.email)
  const [addressId, setAddressId] = useState(0)

  function setChosenAddress(addressId: number, cityName: string) {
    try {
      localStorage.setItem("addressId", addressId.toString())
      localStorage.setItem("city", cityName.toString())

      setAddressId(addressId)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAddressId(Number(localStorage.getItem("addressId")))
    }
  }, [addressId])

  return (
    <>{searchParams.get("storeId")}
      <p>{addressId}</p>
      {addresses ? (
        addresses?.map((address, index) => (
          <div key={index}>
            <p>{address.address + address.cityName + address.id}</p>
            chosen :
            <input
              type="radio"
              checked={addressId == address.id}
              onChange={() => setChosenAddress(address.id, address.cityName)}
            />
            <Link to={address.id.toString()}>Edit</Link>
          </div>
        ))
      ) : (
        <p>No Address Yet</p>
      )}
      <Link to={"/home/addresses/new"}>Create New Address</Link>
      <Outlet></Outlet>
    </>
  )
}
