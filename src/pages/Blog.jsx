import React from 'react';
import PublicHeader from '@/components/public/PublicHeader'; 
import PublicFooter from '../components/public/PublicFooter';


const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [hoveredPost, setHoveredPost] = React.useState(null);


  const categories = ['All', 'University Applications', 'Study Tips', 'Visa Process', 'Country Guides', 'Success Stories'];

  const featuredPost = {
    id: 'featured',
    title: 'Complete Guide to US University Applications 2024',
    excerpt: 'Everything you need to know about applying to US universities, from SAT scores to personal statements and scholarship opportunities.',
    author: 'Sarah Johnson',
    date: 'March 15, 2024',
    readTime: '12 min read',
    category: 'University Applications',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  };

  const blogPosts = [
    {
      id: 1,
      title: 'IELTS vs TOEFL: Which Test Should You Take?',
      excerpt: 'Compare the two most popular English proficiency tests and find out which one suits your study abroad goals better.',
      author: 'Michael Chen',
      date: 'March 12, 2024',
      readTime: '8 min read',
      category: 'Study Tips',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      title: 'Student Visa Requirements: A Country-by-Country Guide',
      excerpt: 'Navigate the complex world of student visas with our comprehensive guide covering popular study destinations.',
      author: 'Emily Rodriguez',
      date: 'March 10, 2024',
      readTime: '15 min read',
      category: 'Visa Process',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      title: 'Life as an International Student in Germany',
      excerpt: 'Discover what it\'s really like to study in Germany, from university culture to daily life and career opportunities.',
      author: 'Alex Mueller',
      date: 'March 8, 2024',
      readTime: '10 min read',
      category: 'Country Guides',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      title: 'From Dreams to Reality: My Journey to Oxford',
      excerpt: 'A personal story of overcoming challenges and achieving the dream of studying at one of the world\'s top universities.',
      author: 'Priya Sharma',
      date: 'March 5, 2024',
      readTime: '6 min read',
      category: 'Success Stories',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Scholarship Opportunities for International Students',
      excerpt: 'Explore various scholarship programs and funding options available for students planning to study abroad.',
      author: 'David Kim',
      date: 'March 3, 2024',
      readTime: '12 min read',
      category: 'University Applications',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'Essential Apps for Study Abroad Students',
      excerpt: 'Must-have mobile applications that will make your international student experience smoother and more enjoyable.',
      author: 'Lisa Wang',
      date: 'March 1, 2024',
      readTime: '7 min read',
      category: 'Study Tips',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const styles = {
    container: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '2rem 1rem',
        paddingTop: 'calc(72px + 2rem)' 
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem'
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '1rem',
      margin: '0 0 1rem 0'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#666',
      margin: 0,
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    featuredSection: {
      marginBottom: '4rem'
    },
    featuredCard: {
      backgroundColor: '#fff',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      minHeight: '400px'
    },
    featuredCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.15)'
    },
    featuredImage: {
      width: '50%',
      objectFit: 'cover'
    },
    featuredContent: {
      padding: '3rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '50%'
    },
    categoryTag: {
      display: 'inline-block',
      backgroundColor: '#000',
      color: '#fff',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '1.5rem'
    },
    featuredTitle: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '1rem',
      lineHeight: '1.3'
    },
    excerpt: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    meta: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      fontSize: '0.9rem',
      color: '#888'
    },
    filterSection: {
      padding: '2rem 0',
      textAlign: 'center'
    },
    filterTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#000'
    },
    filterButtons: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1rem'
    },
    filterButton: {
      padding: '0.75rem 1.5rem',
      border: '2px solid #ddd',
      backgroundColor: '#fff',
      color: '#666',
      borderRadius: '25px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    activeFilter: {
      backgroundColor: '#000',
      color: '#fff',
      borderColor: '#000',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    postsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '2rem',
      padding: '2rem 0 4rem'
    },
    postCard: {
      backgroundColor: '#fff',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    postCardHover: {
      transform: 'translateY(-8px)',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)'
    },
    postImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    postContent: {
      padding: '1.5rem'
    },
    postTitle: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '0.75rem',
      lineHeight: '1.4'
    },
    postExcerpt: {
      fontSize: '0.95rem',
      color: '#666',
      marginBottom: '1.5rem',
      lineHeight: '1.6'
    },
    postMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.85rem',
      color: '#888'
    },
   
    responsiveStyles: `
      @media (max-width: 768px) {
        .featured-card {
          flex-direction: column !important;
          min-height: auto !important;
        }
        .featured-image {
          width: 100% !important;
          height: 250px !important;
        }
        .featured-content {
          width: 100% !important;
          padding: 2rem !important;
        }
        .posts-grid {
          grid-template-columns: 1fr !important;
        }
       
      }
      @media (max-width: 480px) {
        .title {
          font-size: 2rem !important;
        }
        .featured-title {
          font-size: 1.5rem !important;
        }
      }
    `
  };


return (
  <>
    <PublicHeader />
    <div style={styles.container}>
      <style>{styles.responsiveStyles}</style>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Study Abroad Insights</h1>
          <p style={styles.subtitle}>
            Expert advice, success stories, and practical tips to help you navigate your international education journey
          </p>
        </div>

        {/* Featured Post */}
        <section style={styles.featuredSection}>
          <div
            className="featured-card"
            style={{
              ...styles.featuredCard,
              ...(hoveredPost === 'featured' ? styles.featuredCardHover : {})
            }}
            onMouseEnter={() => setHoveredPost('featured')}
            onMouseLeave={() => setHoveredPost(null)}
          >
            <img 
              className="featured-image"
              src={featuredPost.image} 
              alt={featuredPost.title}
              style={styles.featuredImage}
            />
            <div className="featured-content" style={styles.featuredContent}>
              <span style={styles.categoryTag}>{featuredPost.category}</span>
              <h2 className="featured-title" style={styles.featuredTitle}>{featuredPost.title}</h2>
              <p style={styles.excerpt}>{featuredPost.excerpt}</p>
              <div style={styles.meta}>
                <span>{featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Categories */}
        <section style={styles.filterSection}>
          <h3 style={styles.filterTitle}>Browse by Category</h3>
          <div style={styles.filterButtons}>
            {categories.map((category) => (
              <button
                key={category}
                style={{
                  ...styles.filterButton,
                  ...(selectedCategory === category ? styles.activeFilter : {})
                }}
                onClick={() => setSelectedCategory(category)}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.borderColor = '#000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = '#ddd';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="posts-grid" style={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                style={{
                  ...styles.postCard,
                  ...(hoveredPost === post.id ? styles.postCardHover : {})
                }}
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
              >
                <img 
                  src={post.image} 
                  alt={post.title}
                  style={styles.postImage}
                />
                <div style={styles.postContent}>
                  <span style={{
                    ...styles.categoryTag,
                    fontSize: '0.7rem',
                    padding: '0.3rem 0.8rem'
                  }}>
                    {post.category}
                  </span>
                  <h3 style={styles.postTitle}>{post.title}</h3>
                  <p style={styles.postExcerpt}>{post.excerpt}</p>
                  <div style={styles.postMeta}>
                    <span>{post.author}</span>
                    <span>{post.date} • {post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <p>No posts found in the "{selectedCategory}" category.</p>
            </div>
          )}
        </section>

       
      </div>
    </div>
     <PublicFooter />
    </> 
  );
};

export default BlogPage;