import { Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, Pagination, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Search } from "@mui/icons-material";


function srcset(image, width, height, rows = 1, cols = 1) {
    return {
      src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
      srcSet: `${image}?w=${width * cols}&h=${
        height * rows
      }&fit=crop&auto=format&dpr=2 2x`,
    };
  }

const Home = () =>{
    const [noOfPokemon, setNoOfPokemon] = useState(20)
    const [allpokemon, setAllpokemon] = useState([])
    const [filterPokemon, setFilterPokemon] = useState([])


    const handleChange= (e,value) =>{
      setNoOfPokemon(value*20)
      fetchKantoPokemon(value-1,value*20)
    }

    const fetchKantoPokemon = async(number=0,numberOfPokemon=noOfPokemon) =>{
        let result = []
       await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${numberOfPokemon}`)
        .then(response => response.json())
        .then(allpokemon =>{
            result = allpokemon?.results
            result = result.splice(number*20,noOfPokemon)
        })

        let all = []
        for(const ele of result){
            const pokemonData = await detail(ele?.url)
            all.push(pokemonData)
        }
        setAllpokemon(all)
        setFilterPokemon(all)
      }

      useEffect(()=>{
        fetchKantoPokemon(0,20)
      },[])

      const detail = async(url) => {
        let d;
        try {
         await fetch(url)
            .then(response => response.json())
            .then(pokemon => {
                d = {name:pokemon?.name,imagePath:pokemon?.sprites?.front_shiny};
            })
            .catch(error => {
              console.error(error)
            })
        } catch (error) {
          console.error(error)
        }
        return d;
      }

    const search = (text) =>{
      const list = [...allpokemon]
      const filterPokemon = list?.filter(pokemon=>((pokemon?.name || '').toLowerCase()).includes((text).toLowerCase()))
      setFilterPokemon(filterPokemon)
    }

    return(
        <>
            <Typography color={'black'} fontSize={20}>Pokemon List</Typography>
            <TextField
              variant="standard" 
              InputProps={{
                  endAdornment:<Search />,
                  disableUnderline: true}} 
              onChange={(e)=>search(e.target.value)} 
              type={'text'}
              name="search" 
              placeholder="search" 
              required={true} />
            <ImageList
                sx={{ width: 'auto', height: 'auto' }} cols={4} rowHeight={164}
                gap={1}
                >
                {filterPokemon?.map((item) => {
                    const cols = 1
                    const rows = 1

                    return (
                    <ImageListItem key={item?.imagePath} cols={1} rows={rows}>
                        <img
                        {...srcset(item?.imagePath, 200, 200, rows, cols)}
                        alt={item?.name}
                        loading="lazy"
                        />
                        <ImageListItemBar
                        sx={{
                            background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                        }}
                        title={item?.name}
                        position="top"
                        actionIcon={
                            <IconButton
                            sx={{ color: 'white' }}
                            aria-label={`star ${item?.name}`}
                            >
                            <StarBorderIcon />
                            </IconButton>
                        }
                        actionPosition="left"
                        />
                    </ImageListItem>
                    );
                })}
            </ImageList>
            <Pagination style={{paddingLeft:'30%'}} count={10} color="primary" onChange={handleChange} />
        </>
    )
}

export default Home;