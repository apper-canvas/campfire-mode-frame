import Home from '../pages/Home';
import Projects from '../pages/Projects';
import MyAssignments from '../pages/MyAssignments';
import Team from '../pages/Team';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    component: Home,
    path: '/'
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    icon: 'FolderOpen',
    component: Projects,
    path: '/projects'
  },
  assignments: {
    id: 'assignments',
    label: 'My Assignments',
    icon: 'CheckSquare',
    component: MyAssignments,
    path: '/assignments'
  },
  team: {
    id: 'team',
    label: 'Team',
    icon: 'Users',
    component: Team,
    path: '/team'
  }
};

export const routeArray = Object.values(routes);