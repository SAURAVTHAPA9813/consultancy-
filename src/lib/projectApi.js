// src/lib/projectApi.js
// Mock API for Project Management System
// This handles all CRUD operations for projects and tasks

class ProjectAPI {
  constructor() {
    this.storageKeys = {
      projects: 'cms.projects',
      tasks: 'cms.tasks',
      activity: 'cms.activity',
      comments: 'cms.comments'
    };
    
    // Initialize with demo data if empty
    this.initializeDemoData();
  }

  // ===== UTILITY METHODS =====
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error(`Error reading ${key}:`, err);
      return [];
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Error saving ${key}:`, err);
    }
  }

  initializeDemoData() {
    const existingProjects = this.getFromStorage(this.storageKeys.projects);
    if (existingProjects.length === 0) {
      this.seedDemoData();
    }
  }

  seedDemoData() {
    const demoProjects = [
      {
        id: 'proj-1',
        name: 'Website Redesign',
        clientId: 'client-acme',
        branch: 'Main',
        status: 'in-progress',
        budget: 25000,
        dueDate: '2025-09-30',
        members: ['user-1', 'user-2'],
        createdAt: '2025-08-01T10:00:00Z',
        updatedAt: '2025-08-15T14:30:00Z'
      },
      {
        id: 'proj-2',
        name: 'Mobile App Development',
        clientId: 'client-globex',
        branch: 'Main',
        status: 'planned',
        budget: 45000,
        dueDate: '2025-12-15',
        members: ['user-1', 'user-3'],
        createdAt: '2025-08-10T09:00:00Z',
        updatedAt: '2025-08-20T11:15:00Z'
      },
      {
        id: 'proj-3',
        name: 'CRM Integration',
        clientId: 'client-initech',
        branch: 'Tech',
        status: 'on-hold',
        budget: 18000,
        dueDate: '2025-10-30',
        members: ['user-2'],
        createdAt: '2025-07-15T08:00:00Z',
        updatedAt: '2025-08-25T16:45:00Z'
      }
    ];

    const demoTasks = [
      // Website Redesign tasks
      {
        id: 'task-1',
        projectId: 'proj-1',
        title: 'Design Mockups',
        description: 'Create initial design mockups for the homepage and key pages',
        status: 'done',
        assigneeId: 'user-2',
        dueDate: '2025-08-20',
        attachments: [],
        commentsCount: 3,
        createdAt: '2025-08-01T10:30:00Z',
        updatedAt: '2025-08-18T15:20:00Z'
      },
      {
        id: 'task-2',
        projectId: 'proj-1',
        title: 'Frontend Development',
        description: 'Implement the responsive frontend based on approved designs',
        status: 'in-progress',
        assigneeId: 'user-1',
        dueDate: '2025-09-15',
        attachments: [],
        commentsCount: 1,
        createdAt: '2025-08-15T09:00:00Z',
        updatedAt: '2025-08-25T12:30:00Z'
      },
      {
        id: 'task-3',
        projectId: 'proj-1',
        title: 'Content Migration',
        description: 'Migrate existing content to new CMS structure',
        status: 'todo',
        assigneeId: 'user-2',
        dueDate: '2025-09-25',
        attachments: [],
        commentsCount: 0,
        createdAt: '2025-08-20T14:00:00Z',
        updatedAt: '2025-08-20T14:00:00Z'
      },
      
      // Mobile App tasks
      {
        id: 'task-4',
        projectId: 'proj-2',
        title: 'Requirements Gathering',
        description: 'Meet with stakeholders to define app requirements',
        status: 'done',
        assigneeId: 'user-1',
        dueDate: '2025-08-25',
        attachments: [],
        commentsCount: 2,
        createdAt: '2025-08-10T10:00:00Z',
        updatedAt: '2025-08-22T16:00:00Z'
      },
      {
        id: 'task-5',
        projectId: 'proj-2',
        title: 'UI/UX Design',
        description: 'Create wireframes and visual designs for mobile app',
        status: 'in-progress',
        assigneeId: 'user-3',
        dueDate: '2025-09-10',
        attachments: [],
        commentsCount: 0,
        createdAt: '2025-08-15T11:00:00Z',
        updatedAt: '2025-08-28T09:15:00Z'
      },
      {
        id: 'task-6',
        projectId: 'proj-2',
        title: 'Backend API Setup',
        description: 'Set up initial API structure and database schema',
        status: 'todo',
        assigneeId: 'user-1',
        dueDate: '2025-09-20',
        attachments: [],
        commentsCount: 0,
        createdAt: '2025-08-20T13:00:00Z',
        updatedAt: '2025-08-20T13:00:00Z'
      },

      // CRM Integration tasks
      {
        id: 'task-7',
        projectId: 'proj-3',
        title: 'CRM Analysis',
        description: 'Analyze current CRM system and integration points',
        status: 'blocked',
        assigneeId: 'user-2',
        dueDate: '2025-09-05',
        attachments: [],
        commentsCount: 1,
        createdAt: '2025-07-15T08:30:00Z',
        updatedAt: '2025-08-01T10:00:00Z'
      },
      {
        id: 'task-8',
        projectId: 'proj-3',
        title: 'Integration Planning',
        description: 'Plan the technical approach for CRM integration',
        status: 'todo',
        assigneeId: 'user-2',
        dueDate: '2025-09-15',
        attachments: [],
        commentsCount: 0,
        createdAt: '2025-07-20T09:00:00Z',
        updatedAt: '2025-07-20T09:00:00Z'
      }
    ];

    this.saveToStorage(this.storageKeys.projects, demoProjects);
    this.saveToStorage(this.storageKeys.tasks, demoTasks);
    
    // Initialize empty activity and comments
    if (this.getFromStorage(this.storageKeys.activity).length === 0) {
      this.saveToStorage(this.storageKeys.activity, []);
    }
    if (this.getFromStorage(this.storageKeys.comments).length === 0) {
      this.saveToStorage(this.storageKeys.comments, []);
    }
  }

  // ===== PROJECT METHODS =====
  async getProjects(filters = {}) {
    const projects = this.getFromStorage(this.storageKeys.projects);
    const tasks = this.getFromStorage(this.storageKeys.tasks);
    
    // Calculate progress for each project
    const projectsWithProgress = projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      const doneTasks = projectTasks.filter(task => task.status === 'done').length;
      const totalTasks = projectTasks.length;
      const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      
      return {
        ...project,
        progress,
        taskCount: totalTasks
      };
    });

    // Apply filters
    let filtered = projectsWithProgress;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        (p.clientId && p.clientId.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.branch) {
      filtered = filtered.filter(p => p.branch === filters.branch);
    }
    
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    
    // Apply user permissions
    if (filters.userId && filters.userRole) {
      if (filters.userRole === 'consultant') {
        filtered = filtered.filter(p => p.members.includes(filters.userId));
      } else if (filters.userRole === 'client') {
        filtered = filtered.filter(p => p.clientId === filters.userId);
      }
      // Admin sees all projects
    }

    return filtered;
  }

  async getProject(id) {
    const projects = this.getFromStorage(this.storageKeys.projects);
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      throw new Error('Project not found');
    }

    const tasks = await this.getTasks({ projectId: id });
    const doneTasks = tasks.filter(task => task.status === 'done').length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return {
      ...project,
      progress,
      taskCount: totalTasks,
      tasks
    };
  }

  async createProject(projectData) {
    const projects = this.getFromStorage(this.storageKeys.projects);
    const newProject = {
      id: this.generateId(),
      name: projectData.name,
      clientId: projectData.clientId,
      branch: projectData.branch || 'Main',
      status: 'planned',
      budget: projectData.budget || null,
      dueDate: projectData.dueDate || null,
      members: projectData.members || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    projects.push(newProject);
    this.saveToStorage(this.storageKeys.projects, projects);
    
    // Log activity
    await this.logActivity({
      type: 'project_created',
      projectId: newProject.id,
      description: `Project "${newProject.name}" created`
    });

    return newProject;
  }

  async updateProject(id, updates) {
    const projects = this.getFromStorage(this.storageKeys.projects);
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Project not found');
    }

    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage(this.storageKeys.projects, projects);
    
    // Log activity
    await this.logActivity({
      type: 'project_updated',
      projectId: id,
      description: `Project "${projects[index].name}" updated`
    });

    return projects[index];
  }

  async deleteProject(id) {
    const projects = this.getFromStorage(this.storageKeys.projects);
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      throw new Error('Project not found');
    }

    // Delete all associated tasks
    const tasks = this.getFromStorage(this.storageKeys.tasks);
    const filteredTasks = tasks.filter(t => t.projectId !== id);
    this.saveToStorage(this.storageKeys.tasks, filteredTasks);

    // Delete project
    const filteredProjects = projects.filter(p => p.id !== id);
    this.saveToStorage(this.storageKeys.projects, filteredProjects);
    
    // Log activity
    await this.logActivity({
      type: 'project_deleted',
      projectId: id,
      description: `Project "${project.name}" deleted`
    });

    return true;
  }

  // ===== TASK METHODS =====
  async getTasks(filters = {}) {
    let tasks = this.getFromStorage(this.storageKeys.tasks);
    
    if (filters.projectId) {
      tasks = tasks.filter(t => t.projectId === filters.projectId);
    }
    
    if (filters.assigneeId) {
      tasks = tasks.filter(t => t.assigneeId === filters.assigneeId);
    }
    
    if (filters.status) {
      tasks = tasks.filter(t => t.status === filters.status);
    }

    return tasks;
  }

  async getTask(id) {
    const tasks = this.getFromStorage(this.storageKeys.tasks);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async createTask(taskData) {
    const tasks = this.getFromStorage(this.storageKeys.tasks);
    const newTask = {
      id: this.generateId(),
      projectId: taskData.projectId,
      title: taskData.title,
      description: taskData.description || '',
      status: 'todo',
      assigneeId: taskData.assigneeId || null,
      dueDate: taskData.dueDate || null,
      attachments: taskData.attachments || [],
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    this.saveToStorage(this.storageKeys.tasks, tasks);
    
    // Log activity
    await this.logActivity({
      type: 'task_created',
      projectId: newTask.projectId,
      taskId: newTask.id,
      description: `Task "${newTask.title}" created`
    });

    // Check if assignee should be notified
    if (newTask.assigneeId) {
      await this.createNotification({
        type: 'task_assigned',
        userId: newTask.assigneeId,
        projectId: newTask.projectId,
        taskId: newTask.id,
        message: `You were assigned a task: ${newTask.title}`
      });
    }

    return newTask;
  }

  async updateTask(id, updates) {
    const tasks = this.getFromStorage(this.storageKeys.tasks);
    const index = tasks.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }

    const oldTask = tasks[index];
    const updatedTask = {
      ...oldTask,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    this.saveToStorage(this.storageKeys.tasks, tasks);

    // Log activity for status changes
    if (oldTask.status !== updatedTask.status) {
      await this.logActivity({
        type: 'task_status_changed',
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
        description: `Task "${updatedTask.title}" moved from ${oldTask.status} to ${updatedTask.status}`
      });

      // Handle blocked status notification
      if (updatedTask.status === 'blocked') {
        await this.createNotification({
          type: 'task_blocked',
          userId: updatedTask.assigneeId,
          projectId: updatedTask.projectId,
          taskId: updatedTask.id,
          message: `Task blocked: ${updatedTask.title}`
        });
      }
    }

    // Check for project completion after task update
    await this.checkProjectCompletion(updatedTask.projectId);

    return updatedTask;
  }

  async deleteTask(id) {
    const tasks = this.getFromStorage(this.storageKeys.tasks);
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      throw new Error('Task not found');
    }

    const filteredTasks = tasks.filter(t => t.id !== id);
    this.saveToStorage(this.storageKeys.tasks, filteredTasks);
    
    // Log activity
    await this.logActivity({
      type: 'task_deleted',
      projectId: task.projectId,
      taskId: id,
      description: `Task "${task.title}" deleted`
    });

    // Check project completion
    await this.checkProjectCompletion(task.projectId);

    return true;
  }

  // ===== BUSINESS LOGIC =====
  async checkProjectCompletion(projectId) {
    const projects = this.getFromStorage(this.storageKeys.projects);
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) return;

    const tasks = await this.getTasks({ projectId });
    const allTasksDone = tasks.length > 0 && tasks.every(task => task.status === 'done');
    const hasIncompleteTasks = tasks.some(task => task.status !== 'done');

    let newStatus = projects[projectIndex].status;
    
    if (allTasksDone && projects[projectIndex].status !== 'completed') {
      newStatus = 'completed';
      
      // Create notification for project completion
      for (const memberId of projects[projectIndex].members) {
        await this.createNotification({
          type: 'project_completed',
          userId: memberId,
          projectId: projectId,
          message: `Project "${projects[projectIndex].name}" completed`
        });
      }
    } else if (hasIncompleteTasks && projects[projectIndex].status === 'completed') {
      newStatus = 'in-progress';
    }

    if (newStatus !== projects[projectIndex].status) {
      projects[projectIndex].status = newStatus;
      projects[projectIndex].updatedAt = new Date().toISOString();
      this.saveToStorage(this.storageKeys.projects, projects);
      
      await this.logActivity({
        type: 'project_status_changed',
        projectId: projectId,
        description: `Project "${projects[projectIndex].name}" status changed to ${newStatus}`
      });
    }
  }

  // ===== ACTIVITY LOG =====
  async logActivity(activityData) {
    const activities = this.getFromStorage(this.storageKeys.activity);
    const newActivity = {
      id: this.generateId(),
      type: activityData.type,
      projectId: activityData.projectId,
      taskId: activityData.taskId || null,
      userId: activityData.userId || 'current-user', // In real app, get from auth
      description: activityData.description,
      createdAt: new Date().toISOString()
    };

    activities.unshift(newActivity); // Add to beginning
    this.saveToStorage(this.storageKeys.activity, activities);
    
    return newActivity;
  }

  async getActivity(projectId) {
    const activities = this.getFromStorage(this.storageKeys.activity);
    return activities
      .filter(a => a.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // ===== COMMENTS =====
  async getComments(taskId) {
    const comments = this.getFromStorage(this.storageKeys.comments);
    return comments
      .filter(c => c.taskId === taskId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async createComment(commentData) {
    const comments = this.getFromStorage(this.storageKeys.comments);
    const newComment = {
      id: this.generateId(),
      taskId: commentData.taskId,
      authorId: commentData.authorId || 'current-user',
      body: commentData.body,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    this.saveToStorage(this.storageKeys.comments, comments);

    // Update comment count on task
    const tasks = this.getFromStorage(this.storageKeys.tasks);
    const taskIndex = tasks.findIndex(t => t.id === commentData.taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].commentsCount = (tasks[taskIndex].commentsCount || 0) + 1;
      this.saveToStorage(this.storageKeys.tasks, tasks);
    }

    return newComment;
  }

  // ===== NOTIFICATIONS (hooks for your notification system) =====
  async createNotification(notificationData) {
    // This would integrate with your existing notification system
    // For now, just log to console and store for potential display
    console.log('Notification created:', notificationData);
    
    // You can integrate this with your existing notification context
    // by dispatching an event or calling a notification service
    
    return notificationData;
  }

  // ===== UTILITY METHODS FOR UI =====
  getTaskStatusColor(status) {
    const colorMap = {
      'todo': 'gray',
      'in-progress': 'amber', 
      'blocked': 'red',
      'done': 'green'
    };
    return colorMap[status] || 'gray';
  }

  getProjectStatusColor(status) {
    const colorMap = {
      'planned': 'gray',
      'in-progress': 'amber',
      'on-hold': 'orange',
      'completed': 'green'
    };
    return colorMap[status] || 'gray';
  }

  validateTaskMove(fromStatus, toStatus) {
    const allowedMoves = {
      'todo': ['in-progress', 'blocked'],
      'in-progress': ['blocked', 'done', 'todo'],
      'blocked': ['in-progress', 'todo'],
      'done': ['in-progress']
    };
    
    return allowedMoves[fromStatus]?.includes(toStatus) || false;
  }
}

// Export singleton instance
export const projectApi = new ProjectAPI();