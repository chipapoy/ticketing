import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import { NestedMenuItem } from 'mui-nested-menu';

const Filter_Content = (props) => {
   // const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(props.anchorTarget);
   
   // const handleClick = (e) => setAnchorEl(e.currentTarget);
   const handleClose = () => props.filterToggleCallback(null);

   return(
      <div className='h-full'>
         {/* <Button
         
            onClick={handleClick}
         >
            <FunnelIcon className="h-6 w-6 text-blue-500 hover:text-blue-700" aria-hidden={true}/>
         </Button> */}
         <Menu
            anchorEl={props.anchorTarget} 
            open={open} 
            onClose={handleClose}
         >
            <MenuItem onClick = {() => {props.filterCallback({label: "none", item: "none"})}}>
               Default
            </MenuItem>
            <NestedMenuItem 
               label="Active Org"
               parentMenuOpen={open}
            >
               {...props.activeOrgs.map((activeOrg, index) => 
                  (<MenuItem onClick={() => {
                     props.filterCallback({label: "active org", item: activeOrg.name})
                     handleClose
                  }} key={index}>{activeOrg.name}</MenuItem>)
               )}
               
            </NestedMenuItem>
            <NestedMenuItem 
               label="Category"
               parentMenuOpen={open}
            >
               {...props.categories.map((cat, index) => 
                  (<MenuItem onClick={() => {
                     props.filterCallback({label: "category", item: cat.name})
                     handleClose
                  }} key={index}>{cat.name}</MenuItem>)
               )}
               
            </NestedMenuItem>
            <NestedMenuItem
            label="Priority Level"
            parentMenuOpen={open}
            >
               {...props.priority.map((priorityLvl, index) => 
                  (<MenuItem onClick={() => {
                     props.filterCallback({label: "priority", item: priorityLvl.name})
                     handleClose
                  
                  }} key={index}>{priorityLvl.name}</MenuItem>)
               )}
            </NestedMenuItem>
            <NestedMenuItem
            label="Shop"
            parentMenuOpen={open}
            >
               {...props.brands.map((brand, index) => 
                  (<MenuItem onClick={() => {
                     props.filterCallback({label: "shop", item: brand.name})
                     handleClose
                     
                  }} key={index}>{brand.name}</MenuItem>)
               )}
            </NestedMenuItem>
            <NestedMenuItem
            label="Tagging"
            parentMenuOpen={open}
            >
               {...props.tagging.map((tag, index) => 
                  (<MenuItem onClick={() => {
                     props.filterCallback({label: "tagging", item: tag.name})
                     handleClose
                  
                  }} key={index}>{tag.name}</MenuItem>)
               )}
            </NestedMenuItem>
            <NestedMenuItem
            label="Technician Location"
            parentMenuOpen={open}
            >
               {...props.technicians.map((tech, index) => 
                  (<MenuItem onClick={() => {
                     props.filterCallback({label: "tech_loc", item: tech})
                     handleClose
                  
                  }} key={index}>{tech}</MenuItem>)
               )}
            </NestedMenuItem>
            <NestedMenuItem
            label="Technician"
            parentMenuOpen={open}
            >
               {...props.techNames.map((tech, index) =>
                  (<MenuItem onClick={() => {
                     props.filterCallback({label: "technician", item: tech.name})
                     handleClose
                  }} key={index}>{tech.name}</MenuItem>)
               )}
            </NestedMenuItem>

         </Menu>
      </div>
   )
}


export default Filter_Content

   //#region NO WORK
   // const [anchorEl, setAnchorEl] = useState(null);
   // const [nestedAnchorEl, setNestedAnchorEl] = useState(null)

   // const handleClick = (event) => {
   //   setAnchorEl(event.currentTarget);
   // };
 
   // const handleClose = () => {
   //   setAnchorEl(null);
   //   setNestedAnchorEl(null);
   // };
   // const handleNestedHover = (event) => {
   //   setNestedAnchorEl(event.currentTarget);
   // };
   // const handleNestedClose = () => {
   //   setNestedAnchorEl(null);
   // };

   // <div>
   // <Button onClick={handleClick}>
   //    <FunnelIcon className="h-6 w-6 text-black-100" aria-hidden={true}/>
   // </Button>
   // <Menu
   //   anchorEl={anchorEl}
   //   open={Boolean(anchorEl)}
   //   onClose={handleClose}
   //   className='p-4'
   // >
   //   <MenuItem onClick={handleClose} onMouseEnter={handleNestedHover} >Top Level Item 1</MenuItem>
   //   <MenuItem onClick={handleClose} onMouseEnter={handleNestedHover} >Top Level Item 2</MenuItem>
   //   <MenuItem onClick={handleClose} onMouseEnter={handleNestedHover} >
   //     Nested Menu
   //   </MenuItem>
   // </Menu>
   // <Menu
   //   anchorEl={nestedAnchorEl}
   //   open={Boolean(nestedAnchorEl)}
     
   //   onClose={handleNestedClose}
   //   anchorOrigin={{
   //    vertical: 'center',
   //    horizontal: 'right',
   //  }}
   //  transformOrigin={{
   //    vertical: 'top',
   //    horizontal: 'left',
   //  }}
   // >
   //   <MenuItem onClick={handleClose}>Nested Item 1</MenuItem>
   //   <MenuItem onClick={handleClose}>Nested Item 2</MenuItem>
   // </Menu>

   // </div>
   //#endregion


   //#region OLD

// const Filter_Content = () => {
//    const [anchorEl, setAnchorEl] = useState(null);
//    const [hoverState, setHoverState] = useState(false);
//    const [subName, setSubName] = useState("");
//    const [subMenuItems, setSubmenuItems] = useState([]);

//    const [anchorElHover, setAnchorElHover] = useState(null);

//    const open = Boolean(anchorEl);
//    const handleClick = (event) => {
//      setAnchorEl(event.currentTarget);
//    };
//    const handleClose = () => {
//       setHoverState(false)
//       setAnchorEl(null);
//    };

//    const handlePopoverOpen = (event) => {
//       setAnchorElHover(event.currentTarget);
//     };
  
//     const handlePopoverClose = () => {
//       setAnchorElHover(null);
//     };
   
//    const SubMenu = (props) => {

//       return(
//          <Popover
//          anchorEl={props.anchor}

//          anchorOrigin={{
//             vertical: 'center',
//             horizontal: 'right',
//           }}
//           transformOrigin={{
//             vertical: 'center',
//             horizontal: 'left',
//           }}>
//                {props.name}
//          </Popover>
//       )
//    }

//    return (
//       <div>
//          {console.log(`Hover State: ${hoverState}`)}
//       <Button
//         id="basic-button"
//         aria-controls={open ? 'basic-menu' : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? 'true' : undefined}
//         onClick={handleClick}
//       >
//         <FunnelIcon className="h-6 w-6 text-black-100" aria-hidden={true}/>
//       </Button>
//       <Menu
//          id="basic-menu"
//          anchorEl={anchorEl}
//          open={open}
//          onClose={handleClose}
//          MenuListProps={{
//             'aria-labelledby': 'basic-button',
//          }}
//       >
//          <MenuItem 
//             onMouseEnter={() => {
//                handlePopoverOpen
//                setHoverState(true)
//                setSubName("SHOP ITEM")
//                setSubmenuItems([
//                   "SHOP 1",
//                   "SHOP 2",
//                   "SHOP 3",
//                ])
//             }}
//             onMouseLeave={() => {
//                handlePopoverClose
//             }}
//             >
//             Shop
//          </MenuItem>
//          <MenuItem 
//             onMouseEnter={() => {
//                handlePopoverOpen
//                setHoverState(true)
//                setSubName("TECH ITEM")
//                setSubmenuItems([
//                   "SHOP 1",
//                   "SHOP 2",
//                   "SHOP 3",
//                ])
//             }}
//             onMouseLeave={() => {
//                handlePopoverClose
//             }}
//             >
//             Technican
//          </MenuItem>
//       </Menu>
//       {hoverState && <SubMenu 
//          name={subName}
//          items={subMenuItems}
//          anchor={anchorElHover}
//       />}
//     </div>
//    );
// }

//#endregion
