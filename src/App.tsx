import { memo, StrictMode } from 'react';
import routes from './const/routes';
import { RouterProvider} from 'react-router-dom'

const App = () => {
  return (
    <StrictMode>
      <RouterProvider router={routes}/>
    </StrictMode>
  );
};

export default memo(App);