import { useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";


const User = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}api/users`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      return result.users;
    },
  });

  const deleteUser = async (userId) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error deleting user");
      }
      toast.success("User deleted successfully");
      refetch(); 
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.message);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading Users: {error.message}</div>;
  return (
    <>
      <div>
        <h1 className="text-2xl font-poppins font-bold">All Users</h1>
        <div class="font-[sans-serif] overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead class="whitespace-nowrap">
              <tr>
                <th class="p-4 text-left text-sm font-semibold text-black">
                  Name
                </th>
                <th class="p-4 text-left text-sm font-semibold text-black">
                  Mobile
                </th>
                <th class="p-4 text-left text-sm font-semibold text-black">
                  Email
                </th>
                <th class="p-4 text-left text-sm font-semibold text-black">
                  Role
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2"
                    viewBox="0 0 401.998 401.998"
                  >
                    <path
                      d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                      data-original="#000000"
                    />
                  </svg>
                </th>
                {/* <th class="p-4 text-left text-sm font-semibold text-black">
                  Active
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3 fill-gray-400 inline cursor-pointer ml-2"
                    viewBox="0 0 401.998 401.998"
                  >
                    <path
                      d="M73.092 164.452h255.813c4.949 0 9.233-1.807 12.848-5.424 3.613-3.616 5.427-7.898 5.427-12.847s-1.813-9.229-5.427-12.85L213.846 5.424C210.232 1.812 205.951 0 200.999 0s-9.233 1.812-12.85 5.424L60.242 133.331c-3.617 3.617-5.424 7.901-5.424 12.85 0 4.948 1.807 9.231 5.424 12.847 3.621 3.617 7.902 5.424 12.85 5.424zm255.813 73.097H73.092c-4.952 0-9.233 1.808-12.85 5.421-3.617 3.617-5.424 7.898-5.424 12.847s1.807 9.233 5.424 12.848L188.149 396.57c3.621 3.617 7.902 5.428 12.85 5.428s9.233-1.811 12.847-5.428l127.907-127.906c3.613-3.614 5.427-7.898 5.427-12.848 0-4.948-1.813-9.229-5.427-12.847-3.614-3.616-7.899-5.42-12.848-5.42z"
                      data-original="#000000"
                    />
                  </svg>
                </th> */}
                <th class="p-4 text-left text-sm font-semibold text-black">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.map((user, index) => (
                <tr key={index} class="odd:bg-blue-50">
                  <td class="p-4 text-sm">
                    <div class="flex items-center cursor-pointer w-max">
                      {/* <img
                        src="https://readymadeui.com/profile_6.webp"
                        class="w-9 h-9 rounded-full shrink-0"
                      /> */}
                      <div class="ml-4">
                        <p class="text-sm text-black">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td class="p-4 text-sm text-black">
                    <p class="text-xs text-gray-500 mt-0.5">{user.mobile}</p>
                  </td>
                  <td class="p-4 text-sm text-black">
                    <p class="text-xs text-gray-500 mt-0.5">{user.email}</p>
                  </td>
                  <td class="p-4 text-sm text-black">User</td>
                  {/* <td class="p-4 text-sm">
                    <label class="relative cursor-pointer">
                      <input type="checkbox" class="sr-only peer" />
                      <div class="w-11 h-6 flex items-center bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:absolute after:left-[2px] peer-checked:after:border-white after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007bff]"></div>
                    </label>
                  </td> */}
                  <td class="p-4">
                    <button class="mr-4" title="Edit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 fill-blue-500 hover:fill-blue-700"
                        viewBox="0 0 348.882 348.882"
                      >
                        <path
                          d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                          data-original="#000000"
                        />
                        <path
                          d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                          data-original="#000000"
                        />
                      </svg>
                    </button>
                    <button onClick={() => deleteUser(user._id)} title="Delete">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 fill-red-500 hover:fill-red-700"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                          data-original="#000000"
                        />
                        <path
                          d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                          data-original="#000000"
                        />
                      </svg>
                    </button>
                
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={500}
          hideProgressBar={true}
        />
      </div>
    </>
  );
};

export default User;
