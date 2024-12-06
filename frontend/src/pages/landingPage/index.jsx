import React, { useContext, useState } from "react"
import axios from "axios"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import videoIcon from "../../assets/videoIcon.svg"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { UserContext } from "../../context/tokenContext"
import { Navigate } from "react-router-dom"
import noThumbnail from "../../assets/no-thumbnail.jpg"
import gallery from "../../assets/gallery.svg"

const LandingPage = () => {
  const [playlists, setPlaylists] = useState([])
  const [videos, setVideos] = useState([])
  const [accessToken, setAccessToken] = useState(null)
  const YOUTUBE_PLAYLIST_ITEMS_API =
    "https://www.googleapis.com/youtube/v3/playlistItems"
  const { setToken, token, userId } = useContext(UserContext)
  console.log(token, userId)

  const handleImport = async (playlistId) => {
    if (!accessToken) {
      console.error("No access token available")
      return
    }

    try {
      const response = await axios.get(YOUTUBE_PLAYLIST_ITEMS_API, {
        params: {
          part: "snippet,contentDetails",
          playlistId: playlistId,
          maxResults: 24, 
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setVideos(response.data.items)
      console.log("Fetched Videos:", response.data.items)
    } catch (error) {
      console.error("Error fetching playlist items:", error)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse

      
      setAccessToken(access_token)

      
      try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/playlists",
          {
            params: {
              part: "snippet,contentDetails",
              mine: true,
            },
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )

        setPlaylists(response.data.items)
        console.log(response.data.items)
      } catch (error) {
        console.error("Error fetching playlists:", error)
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error)
    },
    scope: "https://www.googleapis.com/auth/youtube.readonly",
  })

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleOnDragEnd = (result) => {
    
    if (!result.destination) return

    
    const items = Array.from(playlists)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    
    setPlaylists(items)
  }

  const handleSaveLayout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/save-layout",
        {
          userId,
          layout: playlists,
        }
      )
      if (response.status === 200) {
        console.log("Layout saved successfully:", response.data.message)
        alert("Layout saved!")
      }
    } catch (error) {
      console.error("Error saving layout:", error)
      alert("Failed to save layout.")
    }
  }

  const handleLoadLayout = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/load-layout?userId=${userId}`
      )
      if (response.status === 200) {
        const layout = response.data.layout
        setPlaylists(layout)
      }
    } catch (error) {
      console.error("Error loading layout:", error)
    }
  }

  if (token == "" || userId=="") {
    return <Navigate to="/login" />
  }

  return (
    <>
      
      <div className=" bg-[#1b1b22] w-full h-screen p-[24px] flex gap-[32px] text-white ">
        {/*Left */}
        <div className=" bg-[#27272f] min-w-[400px] h-full rounded-[16px] ">
          <p className=" text-[36px] p-[24px] font-semibold ">Blaash</p>

          <div className=" p-[24px] flex flex-col gap-[24px] ">
            <div className=" flex gap-[16px] bg-[#1b1b22] p-[16px] rounded-lg ">
              <img src={gallery} alt="Error" className=" w-[24px] h-[24px] " />
              <p>Story</p>
            </div>
            <div className=" flex gap-[16px] bg-[#1b1b22] p-[16px] rounded-lg ">
              <img src={gallery} alt="Error" className=" w-[24px] h-[24px] " />
              <p>Shoppable Video</p>
            </div>
          </div>
        </div>

        <div className=" w-full h-full flex flex-col gap-[24px] ">
          <div className=" flex items-center justify-between p-[24px] w-full h-[80px] bg-[#27272f]  gap-[24px] rounded-[16px] ">
            <p className=" text-[32px] font-medium ">Design Studio</p>
            <button
              onClick={googleLogin}
              className=" bg-[#017efa] p-[8px] rounded-lg "
            >
              Import YouTube Playlist
            </button>
          </div>

          <div className=" flex justify-between items-center pr-[24px]  ">
            <p className=" text-white text-[24px] ">Product Playlists</p>
            <div className=" flex gap-[24px] items-center ">
              <p
                onClick={() => handleSaveLayout()}
                className=" bg-[#017efa] p-[8px] rounded-lg "
              >
                Save Layout
              </p>
              <p
                onClick={() => handleLoadLayout(userId)}
                className=" bg-[#017efa] p-[8px] rounded-lg "
              >
                Load layout
              </p>
            </div>
          </div>
          {/*Main*/}
          <div className=" flex gap-[24px] w-full h-full ">
            <div className=" w-full h-full bg-[#27272f] rounded-[16px] gap-[24px] p-[24px] flex justify-center ">
              {playlists && (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="playlists" direction="horizontal"  type="group">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className=" w-full flex h-full gap-[24px] "
                      >
                        {playlists.length === 0 ? (
                          <div className=" w-full h-full flex justify-center items-center flex-col gap-[16px] ">
                            <p className=" text-[48px]">No playlists found</p>
                            <p className="text-[20px]">
                              Import playlist from youtube
                            </p>
                            <button
                              onClick={googleLogin}
                              className=" bg-[#017efa] p-[8px] rounded-lg "
                            >
                              Import YouTube Playlist
                            </button>
                          </div>
                        ) : (
                          playlists.map((playlist, index) => (
                            <Draggable
                              key={playlist.id}
                              draggableId={playlist.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  className="relative bg-opacity-50 cursor-pointer max-w-[300px] h-[200px] w-full "
                                  onClick={() => handleImport(playlist.id)}
                                >
                                  <img
                                    src={playlist.snippet.thumbnails.high.url}
                                    alt={"Error"}
                                    className="w-full h-[200px] opacity-50 rounded-[24px]"
                                  />
                                  <div className="w-full absolute bottom-0 flex flex-col gap-[4px]">
                                    <p className="text-white text-left font-bold flex items-center gap-[8px]">
                                      <span className="bg-[#017efa] w-[20px] h-[20px] rounded-r-[24px]" />
                                      {playlist.snippet.title}
                                    </p>
                                    <p className="rounded-b-[24px] flex bg-[#1c1c23] w-full justify-center items-center gap-[16px]">
                                      <img
                                        src={videoIcon}
                                        className="w-[24px] h-[24px]"
                                      />
                                      {playlist.contentDetails.itemCount} Videos
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>

            {/*Right*/}
            <div className=" max-w-[500px] bg-[#27272f] min-w-[500px] h-full rounded-[16px] ">
              {videos.length === 0 ? (
                <div className=" w-full h-full flex justify-center items-center flex-col ">
                  <p className="  text-[36px] ">No videos found for videos</p>
                  <p>Select a playlist</p>
                </div>
              ) : (
                <div className=" ">
                  <p className=" text-[24px] p-[24px] pb-[0px] ">
                    Product List
                  </p>
                  <div className=" overflow-auto h-[73vh] p-[24px] flex flex-col gap-[24px] ">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className=" border border-[#35373b] flex rounded-[16px] p-[16px] gap-[16px] "
                      >
                        <img
                          src={
                            video?.snippet?.thumbnails?.default?.url ||
                            noThumbnail
                          }
                          alt="Thumbnail"
                          className=" w-[60px] h-[60px] rounded-[16px] "
                        />
                        <div>
                          <p>{video?.snippet?.title}</p>
                          <p>{formatDate(video.snippet.publishedAt)}</p>
                          <p className="text-sm text-gray-500">
                            By {video.snippet.channelTitle} (
                            {formatDate(video.snippet.publishedAt)})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingPage
