'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import {
  Box,
  Button,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from 'firebase/firestore'
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles'

let theme = createTheme()
theme = responsiveFontSizes(theme)

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updatePantry = async (searchValue) => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      if (doc.id.startsWith(searchValue)) {
        pantryList.push({
          name: doc.id,
          ...doc.data(),
        })
      }
    })
    setPantry(pantryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updatePantry('')
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updatePantry('')
  }

  useEffect(() => {
    updatePantry('')
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  function handleSubmit(event) {
    event.preventDefault()
    addItem(itemName.toLowerCase())
    setItemName('')
    handleClose()
  }

  return (
    // Page Box
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      pt={5}
      pb={15}
      alignItems="center"
      gap={2}
      bgcolor="#f5f5f5"
    >
      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{ transform: 'translate(-50%,-50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          {/* Add Item Form */}
          <form onSubmit={handleSubmit}>
            <Stack
              width="100%"
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
            >
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value)
                }}
              />
              <Button variant="outlined" type="submit">
                ADD
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>

      <ThemeProvider theme={theme}>
        {/* Bordered Box */}
        <Box border="1px solid #333" minWidth="45%" maxWidth="80%">
          {/* Title Box */}
          <Box
            height="100px"
            bgcolor="#31a370"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={2}
          >
            <Typography variant="h2" color="#333">
              Pantry Items
            </Typography>
          </Box>

          {/* Search Bar Box */}
          <Box
            width="100%"
            height="40px"
            bgcolor="lightgray"
            display="flex"
            justifyContent="center"
          >
            {/* Search Field Box */}
            <Box width="50%">
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                placeholder="Search"
                size="small"
                fullWidth
                onChange={(e) => {
                  updatePantry(e.target.value.toLowerCase())
                }}
              />
            </Box>
          </Box>

          {/* Pantry Items Stack */}
          <Stack width="100%" minHeight="300px" spacing={0.5} overflow="auto">
            {pantry.map(({ name, quantity }) => (
              // Item Box
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#b8b8b8"
                sx={{
                  flexDirection: { xs: 'column', md: 'row' },
                  padding: { xs: 1.5, md: 5 },
                }}
              >
                <Typography
                  variant="h3"
                  color="#333"
                  textAlign="center"
                  width="250px"
                  overflow="auto"
                  sx={{ pb: { xs: '10px', md: 0 } }}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>

                <Typography
                  variant="h3"
                  color="#333"
                  textAlign="center"
                  sx={{ pb: { xs: '10px', md: 0 } }}
                >
                  {quantity}
                </Typography>

                {/* Add/Remove Buttons Stack */}
                <Stack direction="row" spacing={2} pl="30px">
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(name)
                    }}
                  >
                    Add
                  </Button>

                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(name)
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </ThemeProvider>

      {/* Open Add Item Form */}
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
    </Box>
  )
}
