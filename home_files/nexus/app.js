const { useState } = React;

function App() {
    return (
        <div>
            <Header />
            <MainContent />
            <Footer />
            <Chatbot />
        </div>
    );
}

function Header() {
    return (
        <header>
            <h1>LumioNexus</h1>
        </header>
    );
}

function MainContent() {
    return (
        <main>
            <section id="home">
                <h2>Welcome to LumioNexus</h2>
                <p>Welcome to LumioNexus, your premier AI consulting partner. 
                    At LumioNexus, we believe in harnessing the power of artificial intelligence to transform businesses and drive innovation. 
                    Our team of experts is dedicated to providing cutting-edge AI solutions that cater to your unique needs. 
                    Whether you're looking to enhance customer experiences, streamline operations, or gain deep insights from your data, we've got you covered.</p>

                <p>We pride ourselves on delivering personalized and impactful AI strategies that align with your business goals. 
                    From initial consultation to implementation and support, we are with you every step of the way. 
                    Explore the future with LumioNexus and let us help you unlock the full potential of AI for your business.</p>
            </section>
            <section id="services">
                <h2>Our Services</h2>
                <p>At LumioNexus, we offer a comprehensive range of AI services designed to meet the diverse needs of our clients. 
                    Our services include AI strategy development, machine learning model deployment, natural language processing, computer vision solutions, and AI-driven analytics. 
                    Our team of experienced professionals works closely with you to understand your challenges and deliver tailored AI solutions that drive measurable results.</p>
                <p>We understand that every business is unique, which is why we take a customized approach to each project. 
                    Our goal is to empower your organization with advanced AI capabilities that enhance efficiency, improve decision-making, and create new opportunities for growth. 
                    Discover how our AI services can transform your business and give you a competitive edge.</p>
            </section>
            <section id="about">
                <h2>About Us</h2>
                <p>LumioNexus is a team of passionate AI enthusiasts committed to transforming businesses through innovative AI solutions. 
                    Our journey began with a shared vision of making AI accessible and impactful for organizations of all sizes. Over the years, we have successfully delivered numerous AI projects across various industries, earning the trust and satisfaction of our clients.</p>
                <p>Our mission is to bridge the gap between technology and business by providing expert AI consulting services. We believe in a collaborative approach, working closely with our clients to understand their goals and challenges. 
                    With a strong focus on quality, innovation, and customer satisfaction, LumioNexus is dedicated to helping you achieve your AI aspirations.</p>
            </section>
            <section id="contact">
                <h2>Contact Us</h2>
                <p>Reach out to us at contact@lumionexus.com.</p>
                <p>We would love to hear from you! At LumioNexus, we are always ready to assist you with your AI needs. 
                    Whether you have a question about our services, need a consultation, or just want to learn more about AI, feel free to reach out to us. 
                    Our team of experts is here to provide you with the support and guidance you need to succeed.
                </p>
                <p>
                You can contact us via email at contact@lumionexus.com or fill out the contact form on our website. 
                We aim to respond to all inquiries promptly and look forward to connecting with you. 
                Let's start a conversation and explore how LumioNexus can help you leverage the power of AI to transform your business.</p>
            </section>
        </main>
    );
}

function Footer() {
    return (
        <footer>
            <p>&copy; 2024 LumioNexus</p>
        </footer>
    );
}

function Chatbot() {
    const [messages, setMessages] = useState([]);
    
    function handleSendMessage(message) {
        // Dummy function to handle sending message to the bot
        setMessages([...messages, { user: 'You', text: message }, { user: 'Bot', text: 'Hello! How can I assist you today?' }]);
    }

    return (
        <div className="chatbot">
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        </div>
    );
}

function ChatInterface({ messages, onSendMessage }) {
    const [input, setInput] = useState('');
    
    function handleSubmit(event) {
        event.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    }

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user}: </strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
