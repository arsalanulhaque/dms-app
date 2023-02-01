import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { GridCellModes } from '@mui/x-data-grid';

function EditToolbar(props) {
    const { selectedCellParams, cellMode, cellModesModel, setCellModesModel } = props;
  
    const handleSaveOrEdit = () => {
      if (!selectedCellParams) {
        return;
      }
      const { id, field } = selectedCellParams;
      if (cellMode === 'edit') {
        setCellModesModel({
          ...cellModesModel,
          [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } },
        });
      } else {
        setCellModesModel({
          ...cellModesModel,
          [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } },
        });
      }
    };
  
    const handleCancel = () => {
      if (!selectedCellParams) {
        return;
      }
      const { id, field } = selectedCellParams;
      setCellModesModel({
        ...cellModesModel,
        [id]: {
          ...cellModesModel[id],
          [field]: { mode: GridCellModes.View, ignoreModifications: true },
        },
      });
    };
  
    const handleMouseDown = (event) => {
      // Keep the focus in the cell
      event.preventDefault();
    };
  
    return (
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          p: 1,
        }}
      >
        <Button
          onClick={handleSaveOrEdit}
          onMouseDown={handleMouseDown}
          disabled={!selectedCellParams}
          variant="outlined"
        >
          {cellMode === 'edit' ? 'Save' : 'Edit'}
        </Button>
        <Button
          onClick={handleCancel}
          onMouseDown={handleMouseDown}
          disabled={cellMode === 'view'}
          variant="outlined"
          sx={{ ml: 1 }}
        >
          Cancel
        </Button>
      </Box>
    );
  }
  
  EditToolbar.propTypes = {
    cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
    cellModesModel: PropTypes.object.isRequired,
    selectedCellParams: PropTypes.shape({
      field: PropTypes.string.isRequired,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }),
    setCellModesModel: PropTypes.func.isRequired,
  };
  export default EditToolbar;